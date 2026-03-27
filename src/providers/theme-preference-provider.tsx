import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { ThemePreference } from '@/types/wordle';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemePreferenceContextValue = {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  ready: boolean;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

type ThemePreferenceProviderProps = PropsWithChildren<{
  initialPreference?: ThemePreference;
}>;

export function ThemePreferenceProvider({
  children,
  initialPreference,
}: ThemePreferenceProviderProps) {
  const colorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemePreference>(
    initialPreference ?? (colorScheme === 'dark' ? 'dark' : 'light')
  );
  const [ready, setReady] = useState(Boolean(initialPreference));

  useEffect(() => {
    if (initialPreference) {
      setThemePreference(initialPreference);
      setReady(true);
      return;
    }

    if (!ready) {
      setThemePreference(colorScheme === 'dark' ? 'dark' : 'light');
      setReady(true);
    }
  }, [colorScheme, initialPreference, ready]);

  const navigationTheme = themePreference === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemePreferenceContext.Provider value={{ themePreference, setThemePreference, ready }}>
      <ThemeProvider value={navigationTheme}>{children}</ThemeProvider>
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  const context = useContext(ThemePreferenceContext);
  if (!context) {
    throw new Error('useThemePreference must be used inside ThemePreferenceProvider');
  }

  return context;
}
