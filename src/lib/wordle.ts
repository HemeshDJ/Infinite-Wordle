import { ANSWER_WORDS, VALID_GUESSES } from '@/constants/word-list';
import {
  GameMode,
  GameState,
  GuessResult,
  LetterEvaluation,
  LetterStatus,
  MAX_GUESSES,
  StatsState,
  WORD_LENGTH,
} from '@/types/wordle';

const validGuessSet = new Set(VALID_GUESSES);

export const EMPTY_STATS: StatsState = {
  played: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: Array.from({ length: MAX_GUESSES }, () => 0),
};

export function isCompleteWord(value: string) {
  return value.length === WORD_LENGTH;
}

export function isValidGuess(value: string) {
  return validGuessSet.has(value as (typeof VALID_GUESSES)[number]);
}

export function sanitizeGuess(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, '').slice(0, WORD_LENGTH);
}

export function evaluateGuess(guess: string, answer: string): LetterEvaluation[] {
  const result: LetterEvaluation[] = Array.from(guess).map((letter) => ({
    letter,
    status: 'absent',
  }));
  const remaining = Array.from(answer);

  for (const [index, letter] of Array.from(guess).entries()) {
    if (letter === answer[index]) {
      result[index].status = 'correct';
      remaining[index] = '';
    }
  }

  for (const [index, letter] of Array.from(guess).entries()) {
    if (result[index].status === 'correct') {
      continue;
    }
    const matchIndex = remaining.indexOf(letter);
    if (matchIndex >= 0) {
      result[index].status = 'present';
      remaining[matchIndex] = '';
    }
  }

  return result;
}

export function buildKeyboardStatuses(guesses: GuessResult[]) {
  const priority: Record<LetterStatus, number> = {
    absent: 0,
    present: 1,
    correct: 2,
  };
  const statuses: Record<string, LetterStatus> = {};

  for (const guess of guesses) {
    for (const evaluation of guess.evaluation) {
      const current = statuses[evaluation.letter];
      if (!current || priority[evaluation.status] > priority[current]) {
        statuses[evaluation.letter] = evaluation.status;
      }
    }
  }

  return statuses;
}

export function getHardModeViolation(
  guess: string,
  guesses: GuessResult[],
  mode: GameMode
): string | null {
  if (mode !== 'hard' || guesses.length === 0) {
    return null;
  }

  const requiredPositions = new Map<number, string>();
  const requiredLetters = new Map<string, number>();

  for (const priorGuess of guesses) {
    for (const [index, evaluation] of priorGuess.evaluation.entries()) {
      if (evaluation.status === 'correct') {
        requiredPositions.set(index, evaluation.letter);
      }
      if (evaluation.status === 'correct' || evaluation.status === 'present') {
        requiredLetters.set(
          evaluation.letter,
          Math.max(requiredLetters.get(evaluation.letter) ?? 0, countRevealedLetter(priorGuess, evaluation.letter))
        );
      }
    }
  }

  for (const [index, letter] of requiredPositions.entries()) {
    if (guess[index] !== letter) {
      return `Guess ${index + 1} must stay ${letter.toUpperCase()}.`;
    }
  }

  for (const [letter, minimum] of requiredLetters.entries()) {
    const count = Array.from(guess).filter((value) => value === letter).length;
    if (count < minimum) {
      return `Guess must include ${letter.toUpperCase()}.`;
    }
  }

  return null;
}

function countRevealedLetter(guess: GuessResult, letter: string) {
  return guess.evaluation.filter(
    (evaluation) => evaluation.letter === letter && evaluation.status !== 'absent'
  ).length;
}

export function createInitialGame(answer: string, mode: GameMode, usedAnswers: string[]): GameState {
  return {
    answer,
    guesses: [],
    currentGuess: '',
    status: 'playing',
    mode,
    usedAnswers,
  };
}

export function chooseNextAnswer(usedAnswers: string[]) {
  const remaining = ANSWER_WORDS.filter((word) => !usedAnswers.includes(word));
  const pool = remaining.length > 0 ? remaining : ANSWER_WORDS;
  const nextAnswer = pool[Math.floor(Math.random() * pool.length)];
  const nextUsedAnswers = remaining.length > 0 ? [...usedAnswers, nextAnswer] : [nextAnswer];

  return { answer: nextAnswer, usedAnswers: nextUsedAnswers };
}

export function applyGuess(game: GameState, guess: string) {
  const evaluation = evaluateGuess(guess, game.answer);
  const guesses = [...game.guesses, { guess, evaluation }];
  const won = guess === game.answer;
  const lost = !won && guesses.length >= MAX_GUESSES;

  return {
    game: {
      ...game,
      guesses,
      currentGuess: '',
      status: won ? 'won' : lost ? 'lost' : 'playing',
    },
    latestGuess: guesses[guesses.length - 1],
  };
}

export function updateStats(stats: StatsState, game: GameState) {
  if (game.status === 'playing') {
    return stats;
  }

  if (game.status === 'won') {
    const attemptIndex = game.guesses.length - 1;
    const guessDistribution = stats.guessDistribution.map((count, index) =>
      index === attemptIndex ? count + 1 : count
    );
    const currentStreak = stats.currentStreak + 1;

    return {
      played: stats.played + 1,
      wins: stats.wins + 1,
      losses: stats.losses,
      currentStreak,
      maxStreak: Math.max(stats.maxStreak, currentStreak),
      guessDistribution,
    };
  }

  return {
    ...stats,
    played: stats.played + 1,
    losses: stats.losses + 1,
    currentStreak: 0,
  };
}
