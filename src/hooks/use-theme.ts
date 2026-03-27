/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemePreference } from '@/providers/theme-preference-provider';

export function useTheme() {
  const scheme = useColorScheme();
  const { themePreference } = useThemePreference();
  const fallbackTheme = scheme === 'dark' ? 'dark' : 'light';
  const theme = themePreference ?? fallbackTheme;

  return Colors[theme];
}
