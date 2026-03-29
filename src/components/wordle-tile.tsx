import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';
import { LetterStatus } from '@/types/wordle';
import { ThemedText } from '@/components/themed-text';
import { useThemePreference } from '@/providers/theme-preference-provider';

type WordleTileProps = {
  letter: string;
  status?: LetterStatus;
  revealKey: number;
  large?: boolean;
};

export function WordleTile({ letter, status, revealKey, large = true }: WordleTileProps) {
  const scaleY = useRef(new Animated.Value(1)).current;
  const { themePreference } = useThemePreference();
  const palette = Colors[themePreference];

  useEffect(() => {
    if (!status) {
      scaleY.setValue(1);
      return;
    }

    Animated.sequence([
      Animated.timing(scaleY, {
        toValue: 0.12,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(scaleY, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [revealKey, scaleY, status]);

  const backgroundColor = getTileBackground(status, palette);
  const borderColor = getTileBorder(status, palette);
  const textColor = status ? '#ffffff' : palette.text;

  return (
    <Animated.View
      style={[
        styles.tile,
        large ? styles.largeTile : styles.smallTile,
        {
          backgroundColor,
          borderColor,
          transform: [{ scaleY }],
        },
      ]}>
      <View style={styles.face}>
        <ThemedText style={[styles.letter, large ? styles.largeLetter : styles.smallLetter, { color: textColor }]}>
          {letter.toUpperCase()}
        </ThemedText>
      </View>
    </Animated.View>
  );
}

function getTileBackground(status: LetterStatus | undefined, palette: (typeof Colors)[keyof typeof Colors]) {
  if (!status) {
    return palette.background;
  }
  if (status === 'correct') {
    return '#2f8f62';
  }
  if (status === 'present') {
    return '#c9952d';
  }
  return palette.backgroundSelected;
}

function getTileBorder(status: LetterStatus | undefined, palette: (typeof Colors)[keyof typeof Colors]) {
  if (status) {
    return 'transparent';
  }
  return palette.textSecondary;
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 2,
  },
  largeTile: {
    aspectRatio: 1,
    flex: 1,
    minHeight: 48,
  },
  smallTile: {
    width: 32,
    height: 44,
    borderRadius: 10,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: Fonts.rounded,
    fontWeight: '800',
  },
  largeLetter: {
    fontSize: 24,
    lineHeight: 28,
  },
  smallLetter: {
    fontSize: 16,
    lineHeight: 18,
  },
});
