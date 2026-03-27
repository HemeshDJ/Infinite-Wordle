export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export type LetterStatus = 'correct' | 'present' | 'absent';
export type GameStatus = 'playing' | 'won' | 'lost';
export type GameMode = 'standard' | 'hard';
export type ThemePreference = 'light' | 'dark';

export type LetterEvaluation = {
  letter: string;
  status: LetterStatus;
};

export type GuessResult = {
  guess: string;
  evaluation: LetterEvaluation[];
};

export type GameState = {
  answer: string;
  guesses: GuessResult[];
  currentGuess: string;
  status: GameStatus;
  mode: GameMode;
  usedAnswers: string[];
};

export type StatsState = {
  played: number;
  wins: number;
  losses: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
};

export type PersistedState = {
  game: GameState;
  stats: StatsState;
  themePreference: ThemePreference;
};
