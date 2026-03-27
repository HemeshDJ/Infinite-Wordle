import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

type StatChipProps = {
  label: string;
  value: number | string;
};

export function StatChip({ label, value }: StatChipProps) {
  return (
    <View style={styles.chip}>
      <ThemedText type="subtitle" style={styles.value}>
        {value}
      </ThemedText>
      <ThemedText type="small" style={styles.label}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    minWidth: 88,
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: 20,
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    lineHeight: 28,
  },
  label: {
    textAlign: 'center',
  },
});
