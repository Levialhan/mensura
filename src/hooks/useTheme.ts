import { useAppStore } from '../store/useAppStore';
import { darkColors, lightColors, type ThemeColors } from '../theme';

export type ThemeMode = 'light' | 'dark';

export function useTheme(): {
  colors: ThemeColors;
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
} {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  return {
    colors: theme === 'dark' ? darkColors : lightColors,
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  };
}
