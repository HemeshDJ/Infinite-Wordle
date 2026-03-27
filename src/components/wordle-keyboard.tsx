import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { LetterStatus } from '@/types/wordle';
import { ThemedText } from '@/components/themed-text';
import { useThemePreference } from '@/providers/theme-preference-provider';

const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

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

  return (
    <View style={styles.wrapper}>
      {KEY_ROWS.map((row, rowIndex) => (
        <View key={row} style={styles.row}>
          {rowIndex === 2 ? (
            <KeyboardKey label="Enter" wide palette={palette} onPress={onEnterPress} />
          ) : null}
          {Array.from(row).map((letter) => (
            <KeyboardKey
              key={letter}
              label={letter}
              status={statuses[letter.toLowerCase()]}
              palette={palette}
              onPress={() => onKeyPress(letter.toLowerCase())}
            />
          ))}
          {rowIndex === 2 ? (
            <KeyboardKey label="Delete" wide palette={palette} onPress={onDeletePress} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

type KeyboardKeyProps = {
  label: string;
  onPress: () => void;
  wide?: boolean;
  status?: LetterStatus;
  palette: (typeof Colors)['light'];
};

function KeyboardKey({ label, onPress, wide, status, palette }: KeyboardKeyProps) {
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
      onPress={onPress}
      style={({ pressed }) => [
        styles.key,
        wide && styles.keyWide,
        { backgroundColor, opacity: pressed ? 0.8 : 1 },
      ]}>
      <ThemedText style={[styles.keyLabel, status && styles.filledKeyLabel]}>{label}</ThemedText>
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
  },
  key: {
    minWidth: 30,
    flex: 1,
    maxWidth: 44,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  keyWide: {
    flex: 1.5,
    maxWidth: 72,
  },
  keyLabel: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
  },
  filledKeyLabel: {
    color: '#ffffff',
  },
});
