import React from 'react';
import { Stack } from 'expo-router';

import { ThemePreferenceProvider } from '@/providers/theme-preference-provider';

export default function TabLayout() {
  return (
    <ThemePreferenceProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="privacy" />
      </Stack>
    </ThemePreferenceProvider>
  );
}
