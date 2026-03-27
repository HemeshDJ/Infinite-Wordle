import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { WORD_LENGTH, GuessResult } from '@/types/wordle';
import { WordleTile } from '@/components/wordle-tile';

type WordleRowProps = {
  guess?: GuessResult;
  currentGuess?: string;
  revealKey: number;
  shakeKey: number;
};

export function WordleRow({ guess, currentGuess = '', revealKey, shakeKey }: WordleRowProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!shakeKey) {
      return;
    }

    Animated.sequence([
      Animated.timing(translateX, { toValue: -10, duration: 35, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 10, duration: 35, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -8, duration: 35, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 8, duration: 35, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 35, useNativeDriver: true }),
    ]).start();
  }, [shakeKey, translateX]);

  return (
    <Animated.View style={[styles.row, { transform: [{ translateX }] }]}>
      {Array.from({ length: WORD_LENGTH }, (_, index) => {
        const evaluatedLetter = guess?.evaluation[index];
        const letter = evaluatedLetter?.letter ?? currentGuess[index] ?? '';

        return (
          <WordleTile
            key={`${index}-${revealKey}`}
            letter={letter}
            status={evaluatedLetter?.status}
            revealKey={revealKey}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    width: '100%',
  },
});
