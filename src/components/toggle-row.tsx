import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

type ToggleRowProps = {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
};

export function ToggleRow({ label, description, value, onToggle }: ToggleRowProps) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]} onPress={onToggle}>
      <View style={styles.copy}>
        <ThemedText type="smallBold">{label}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>
      <View style={[styles.toggle, value && styles.toggleOn]}>
        <View style={[styles.knob, value && styles.knobOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
  },
  pressed: {
    opacity: 0.8,
  },
  copy: {
    flex: 1,
    gap: Spacing.one,
  },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 999,
    padding: 4,
    justifyContent: 'center',
    backgroundColor: '#b3bac4',
  },
  toggleOn: {
    backgroundColor: '#2f8f62',
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
});
