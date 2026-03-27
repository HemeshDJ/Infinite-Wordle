import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ModalCard } from '@/components/modal-card';
import { StatChip } from '@/components/stat-chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ToggleRow } from '@/components/toggle-row';
import { WordleKeyboard } from '@/components/wordle-keyboard';
import { WordleRow } from '@/components/wordle-row';
import { WordleTile } from '@/components/wordle-tile';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { EMPTY_STATS, applyGuess, buildKeyboardStatuses, chooseNextAnswer, createInitialGame, getHardModeViolation, isCompleteWord, isValidGuess, sanitizeGuess, updateStats } from '@/lib/wordle';
import { loadPersistedState, savePersistedState } from '@/lib/storage';
import { useTheme } from '@/hooks/use-theme';
import { useThemePreference } from '@/providers/theme-preference-provider';
import { GameState, GuessResult, MAX_GUESSES, StatsState, ThemePreference } from '@/types/wordle';

export default function HomeScreen() {
  const theme = useTheme();
  const { themePreference, setThemePreference, ready } = useThemePreference();
  const [game, setGame] = useState<GameState | null>(null);
  const [stats, setStats] = useState<StatsState>(EMPTY_STATS);
  const [message, setMessage] = useState('Type your first guess.');
  const [helpVisible, setHelpVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [activeRevealRow, setActiveRevealRow] = useState(-1);
  const [shakeRow, setShakeRow] = useState(-1);
  const [shakeNonce, setShakeNonce] = useState(0);
  const [inputVersion, setInputVersion] = useState(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!ready) {
      return;
    }

    let mounted = true;

    async function bootstrap() {
      const persisted = await loadPersistedState();
      if (!mounted) {
        return;
      }

      if (persisted) {
        setThemePreference(persisted.themePreference);
        setStats(persisted.stats);
        setGame(persisted.game);
        setMessage(persisted.game.status === 'playing' ? 'Welcome back.' : getResultMessage(persisted.game));
        setResultVisible(persisted.game.status !== 'playing');
        return;
      }

      const firstRound = startNewRound([], 'standard');
      setGame(firstRound);
    }

    bootstrap().catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, [ready, setThemePreference]);

  useEffect(() => {
    if (!game) {
      return;
    }

    savePersistedState({ game, stats, themePreference }).catch(() => undefined);
  }, [game, stats, themePreference]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [game, inputVersion]);

  if (!game) {
    return (
      <ThemedView style={[styles.loadingScreen, { backgroundColor: theme.background }]}>
        <ThemedText type="subtitle">Loading your puzzle...</ThemedText>
      </ThemedView>
    );
  }

  const keyboardStatuses = buildKeyboardStatuses(game.guesses);
  const winRate = stats.played === 0 ? 0 : Math.round((stats.wins / stats.played) * 100);

  function updateCurrentGuess(nextGuess: string) {
    const cleanGuess = sanitizeGuess(nextGuess);
    setGame((current) => (current ? { ...current, currentGuess: cleanGuess } : current));
  }

  function handleLetter(letter: string) {
    if (game.status !== 'playing' || game.currentGuess.length >= 5) {
      return;
    }
    updateCurrentGuess(game.currentGuess + letter);
  }

  function handleDelete() {
    if (game.status !== 'playing') {
      return;
    }
    updateCurrentGuess(game.currentGuess.slice(0, -1));
  }

  async function handleSubmit() {
    if (game.status !== 'playing') {
      return;
    }

    const guess = sanitizeGuess(game.currentGuess);
    if (!isCompleteWord(guess)) {
      rejectGuess('Guess must be 5 letters.');
      return;
    }
    if (!isValidGuess(guess)) {
      rejectGuess('That word is not in the list.');
      return;
    }

    const hardModeViolation = getHardModeViolation(guess, game.guesses, game.mode);
    if (hardModeViolation) {
      rejectGuess(hardModeViolation);
      return;
    }

    const applied = applyGuess(game, guess);
    const nextStats = updateStats(stats, applied.game);

    setGame(applied.game);
    setStats(nextStats);
    setActiveRevealRow(applied.game.guesses.length - 1);
    setMessage(getGuessMessage(applied.game, applied.latestGuess));

    if (applied.game.status !== 'playing') {
      setResultVisible(true);
      await triggerHaptic(applied.game.status === 'won' ? 'success' : 'warning');
      return;
    }

    await triggerHaptic('light');
  }

  async function rejectGuess(nextMessage: string) {
    setMessage(nextMessage);
    setShakeRow(game.guesses.length);
    setShakeNonce((value) => value + 1);
    await triggerHaptic('error');
    setTimeout(() => setShakeRow(-1), 250);
  }

  function handlePlayAgain() {
    const nextRound = startNewRound(game.usedAnswers, game.mode);
    setGame(nextRound);
    setMessage(game.status === 'won' ? 'Fresh puzzle ready.' : `The word was ${game.answer.toUpperCase()}. New round ready.`);
    setResultVisible(false);
    setActiveRevealRow(-1);
    setShakeRow(-1);
    setInputVersion((value) => value + 1);
  }

  function handleResetStats() {
    setStats(EMPTY_STATS);
    setSettingsVisible(false);
    setMessage('Stats reset. Current puzzle preserved.');
  }

  function handleThemeToggle() {
    const nextPreference: ThemePreference = themePreference === 'dark' ? 'light' : 'dark';
    setThemePreference(nextPreference);
  }

  function handleModeToggle() {
    const nextMode = game.mode === 'standard' ? 'hard' : 'standard';
    setGame({ ...game, mode: nextMode });
    setMessage(nextMode === 'hard' ? 'Hard mode is on.' : 'Standard mode is back on.');
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <TextInput
          ref={inputRef}
          value={game.currentGuess}
          onChangeText={updateCurrentGuess}
          onSubmitEditing={handleSubmit}
          autoCapitalize="characters"
          autoCorrect={false}
          blurOnSubmit={false}
          showSoftInputOnFocus={false}
          spellCheck={false}
          style={styles.hiddenInput}
        />

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="always">
          <View style={styles.topBar}>
            <View>
              <ThemedText type="smallBold" themeColor="textSecondary">
                Infinite Wordle
              </ThemedText>
              <ThemedText type="title" style={styles.title}>
                Play the next good word
              </ThemedText>
            </View>
            <View style={styles.actions}>
              <TopAction label="Help" onPress={() => setHelpVisible(true)} />
              <TopAction label="Stats" onPress={() => setStatsVisible(true)} />
              <TopAction label="Settings" onPress={() => setSettingsVisible(true)} />
            </View>
          </View>

          <ThemedView style={[styles.heroCard, getHeroBackground(themePreference)]}>
            <View style={styles.heroMeta}>
              <ThemedText type="smallBold">Mode: {game.mode === 'hard' ? 'Hard' : 'Standard'}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {stats.currentStreak} streak • {stats.wins} wins • {winRate}% win rate
              </ThemedText>
            </View>
            <ThemedText style={styles.message}>{message}</ThemedText>
          </ThemedView>

          <Pressable style={styles.boardShell} onPress={() => inputRef.current?.focus()}>
            <View style={styles.board}>
              {Array.from({ length: MAX_GUESSES }, (_, rowIndex) => (
                <WordleRow
                  key={`row-${rowIndex}`}
                  guess={game.guesses[rowIndex]}
                  currentGuess={rowIndex === game.guesses.length ? game.currentGuess : ''}
                  revealKey={activeRevealRow === rowIndex ? game.guesses.length : 0}
                  shakeKey={shakeRow === rowIndex ? shakeNonce : 0}
                />
              ))}
            </View>
          </Pressable>

          <WordleKeyboard
            statuses={keyboardStatuses}
            onKeyPress={handleLetter}
            onDeletePress={handleDelete}
            onEnterPress={handleSubmit}
          />
        </ScrollView>

        <ModalCard visible={helpVisible} title="How to play" onClose={() => setHelpVisible(false)}>
          <ThemedText>
            Guess the hidden 5-letter word in six tries. Tile colors show how close you are.
          </ThemedText>
          <View style={styles.legendRow}>
            <WordLegend label="Correct" description="Letter is in the word and in the right spot." status="correct" />
            <WordLegend label="Present" description="Letter is in the word but in a different spot." status="present" />
            <WordLegend label="Absent" description="Letter is not in the word for this round." status="absent" />
          </View>
          <ThemedText themeColor="textSecondary">
            Hard mode keeps discovered hints locked in future guesses. New rounds never repeat until the local answer deck has been used up.
          </ThemedText>
        </ModalCard>

        <ModalCard visible={statsVisible} title="Stats" onClose={() => setStatsVisible(false)}>
          <View style={styles.statsGrid}>
            <StatChip label="Played" value={stats.played} />
            <StatChip label="Wins" value={stats.wins} />
            <StatChip label="Losses" value={stats.losses} />
            <StatChip label="Win rate" value={`${winRate}%`} />
            <StatChip label="Current streak" value={stats.currentStreak} />
            <StatChip label="Best streak" value={stats.maxStreak} />
          </View>
          <View style={styles.distribution}>
            <ThemedText type="smallBold">Guess distribution</ThemedText>
            {stats.guessDistribution.map((count, index) => (
              <View key={`dist-${index}`} style={styles.distributionRow}>
                <ThemedText type="smallBold">{index + 1}</ThemedText>
                <View style={styles.distributionBarTrack}>
                  <View
                    style={[
                      styles.distributionBarFill,
                      { width: `${Math.max((count / Math.max(...stats.guessDistribution, 1)) * 100, count > 0 ? 10 : 0)}%` },
                    ]}
                  />
                </View>
                <ThemedText type="small">{count}</ThemedText>
              </View>
            ))}
          </View>
        </ModalCard>

        <ModalCard visible={settingsVisible} title="Settings" onClose={() => setSettingsVisible(false)}>
          <View style={styles.settingsBlock}>
            <ToggleRow
              label="Hard mode"
              description="Revealed hints must be reused in every next guess."
              value={game.mode === 'hard'}
              onToggle={handleModeToggle}
            />
            <ToggleRow
              label="Dark theme"
              description="Switch between the warm light palette and the night palette."
              value={themePreference === 'dark'}
              onToggle={handleThemeToggle}
            />
            <Pressable style={styles.textButton} onPress={() => setHelpVisible(true)}>
              <ThemedText type="smallBold">Open help</ThemedText>
            </Pressable>
            <Pressable style={[styles.textButton, styles.resetButton]} onPress={handleResetStats}>
              <ThemedText type="smallBold" style={styles.resetText}>
                Reset stats
              </ThemedText>
            </Pressable>
          </View>
        </ModalCard>

        <ModalCard visible={resultVisible} title={game.status === 'won' ? 'You solved it' : 'Round over'} onClose={() => setResultVisible(false)}>
          <ThemedText>{getResultMessage(game)}</ThemedText>
          <Pressable style={styles.playAgainButton} onPress={handlePlayAgain}>
            <ThemedText type="smallBold" style={styles.playAgainLabel}>
              Play again
            </ThemedText>
          </Pressable>
        </ModalCard>
      </SafeAreaView>
    </ThemedView>
  );
}

function TopAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.topAction, pressed && styles.topActionPressed]} onPress={onPress}>
      <ThemedText type="smallBold">{label}</ThemedText>
    </Pressable>
  );
}

function WordLegend({
  label,
  description,
  status,
}: {
  label: string;
  description: string;
  status: GuessResult['evaluation'][number]['status'];
}) {
  return (
    <View style={styles.legendItem}>
      <View style={styles.legendTile}>
        <WordleTile letter={label[0]} status={status} revealKey={1} large={false} />
      </View>
      <View style={styles.legendCopy}>
        <ThemedText type="smallBold">{label}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>
    </View>
  );
}

function startNewRound(usedAnswers: string[], mode: GameState['mode']) {
  const next = chooseNextAnswer(usedAnswers);
  return createInitialGame(next.answer, mode, next.usedAnswers);
}

async function triggerHaptic(type: 'light' | 'success' | 'warning' | 'error') {
  if (Platform.OS === 'web') {
    return;
  }

  if (type === 'light') {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    return;
  }

  const notificationType =
    type === 'success'
      ? Haptics.NotificationFeedbackType.Success
      : type === 'warning'
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Error;

  await Haptics.notificationAsync(notificationType);
}

function getGuessMessage(game: GameState, latestGuess: GuessResult) {
  if (game.status === 'won') {
    return `Brilliant. ${latestGuess.guess.toUpperCase()} was the word.`;
  }
  if (game.status === 'lost') {
    return `Out of turns. The word was ${game.answer.toUpperCase()}.`;
  }
  return `Locked in ${latestGuess.guess.toUpperCase()}.`;
}

function getResultMessage(game: GameState) {
  if (game.status === 'won') {
    return `Solved in ${game.guesses.length} ${game.guesses.length === 1 ? 'guess' : 'guesses'}.`;
  }
  return `The answer was ${game.answer.toUpperCase()}.`;
}

function getHeroBackground(themePreference: ThemePreference) {
  return themePreference === 'dark'
    ? { backgroundColor: '#241d1a', borderColor: '#3c322c' }
    : { backgroundColor: '#fff7ec', borderColor: '#e6d4bb' };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  content: {
    flexGrow: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.four,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.three,
    flexWrap: 'wrap',
  },
  title: {
    maxWidth: 420,
    fontSize: 42,
    lineHeight: 44,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  topAction: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
    backgroundColor: 'rgba(127, 112, 95, 0.12)',
  },
  topActionPressed: {
    opacity: 0.8,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  heroMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  message: {
    fontSize: 18,
    lineHeight: 26,
  },
  boardShell: {
    alignSelf: 'center',
    width: '100%',
  },
  board: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: Spacing.two,
  },
  legendRow: {
    gap: Spacing.three,
  },
  legendItem: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
  legendTile: {
    width: 56,
  },
  legendCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  distribution: {
    gap: Spacing.two,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  distributionBarTrack: {
    flex: 1,
    height: 18,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(127, 112, 95, 0.18)',
  },
  distributionBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#2f8f62',
  },
  settingsBlock: {
    gap: Spacing.four,
  },
  textButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: 16,
    backgroundColor: 'rgba(127, 112, 95, 0.12)',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#f9d7d3',
  },
  resetText: {
    color: '#7f2d20',
  },
  playAgainButton: {
    marginTop: Spacing.two,
    borderRadius: 18,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    backgroundColor: '#2f8f62',
  },
  playAgainLabel: {
    color: '#ffffff',
  },
});
