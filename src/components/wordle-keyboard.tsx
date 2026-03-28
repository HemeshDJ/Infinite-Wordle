import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { LetterStatus } from '@/types/wordle';
import { ThemedText } from '@/components/themed-text';
import { useThemePreference } from '@/providers/theme-preference-provider';

const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const COMPACT_LAYOUT_BREAKPOINT = 400;

type WordleKeyboardProps = {
  statuses: Record<string, LetterStatus>;
  onKeyPress: (value: string) => void;
  onEnterPress: () => void;
  onDeletePress: () => void;
};

export function WordleKeyboard({
  statuses,
  onKeyPress,
  onEnterPress,
  onDeletePress,
}: WordleKeyboardProps) {
  const { themePreference } = useThemePreference();
  const palette = Colors[themePreference];
  const { width } = useWindowDimensions();
  const isCompact = width <= COMPACT_LAYOUT_BREAKPOINT;

  return (
    <View style={styles.wrapper}>
      {KEY_ROWS.map((row, rowIndex) => (
        <View key={row} style={[styles.row, isCompact && styles.rowCompact]}>
          {rowIndex === 2 ? (
            <KeyboardKey
              label="Enter"
              accessibilityLabel="Enter"
              wide
              compact={isCompact}
              palette={palette}
              onPress={onEnterPress}
            />
          ) : null}
          {Array.from(row).map((letter) => (
            <KeyboardKey
              key={letter}
              label={letter}
              status={statuses[letter.toLowerCase()]}
              compact={isCompact}
              palette={palette}
              onPress={() => onKeyPress(letter.toLowerCase())}
            />
          ))}
          {rowIndex === 2 ? (
            <KeyboardKey
              label={isCompact ? 'Del' : 'Delete'}
              accessibilityLabel="Delete"
              wide
              compact={isCompact}
              palette={palette}
              onPress={onDeletePress}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}

type KeyboardKeyProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  wide?: boolean;
  compact?: boolean;
  status?: LetterStatus;
  palette: (typeof Colors)[keyof typeof Colors];
};

function KeyboardKey({
  label,
  onPress,
  accessibilityLabel,
  wide,
  compact,
  status,
  palette,
}: KeyboardKeyProps) {
  const backgroundColor =
    status === 'correct'
      ? '#2f8f62'
      : status === 'present'
        ? '#c9952d'
        : status === 'absent'
          ? palette.backgroundSelected
          : palette.backgroundElement;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.key,
        compact && styles.keyCompact,
        wide && styles.keyWide,
        wide && compact && styles.keyWideCompact,
        { backgroundColor, opacity: pressed ? 0.8 : 1 },
      ]}>
      <ThemedText style={[styles.keyLabel, compact && styles.keyLabelCompact, status && styles.filledKeyLabel]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.two,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
    flexWrap: 'nowrap',
  },
  rowCompact: {
    gap: 3,
  },
  key: {
    minWidth: 30,
    flex: 1,
    flexShrink: 1,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  keyCompact: {
    minWidth: 24,
    paddingVertical: 12,
    paddingHorizontal: 2,
  },
  keyWide: {
    flex: 1.45,
  },
  keyWideCompact: {
    flex: 1.25,
  },
  keyLabel: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
  },
  keyLabelCompact: {
    fontSize: 12,
    lineHeight: 14,
  },
  filledKeyLabel: {
    color: '#ffffff',
  },
});
