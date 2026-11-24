/**
 * Mensura design tokens — light + dark palettes.
 *
 * Accent colors (primary, pro, success, danger) and the dark "instrument"
 * surfaces are shared across both themes; only the app chrome (backgrounds,
 * cards, text, borders, soft tints) changes between light and dark.
 */
export const lightColors = {
  // App chrome (light)
  bg: '#F4F6FB',
  card: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',

  // Brand
  primary: '#2563EB',
  primarySoft: '#EAF1FE',

  // Pro
  pro: '#B8860B',
  proSoft: '#FBF3DE',

  // Status
  success: '#16A34A',
  danger: '#DC2626',

  // Instrument surfaces (always dark)
  instrumentBg: '#0B1220',
  instrumentPanel: '#131D32',
  instrumentText: '#E8EEF9',
  instrumentMuted: '#7C8AA5',
  instrumentAccent: '#34D399',
};

export type ThemeColors = typeof lightColors;

export const darkColors: ThemeColors = {
  ...lightColors,
  bg: '#0B1220',
  card: '#16203A',
  text: '#E8EEF9',
  textMuted: '#8A97B0',
  border: '#26324D',
  primarySoft: '#1E2A47',
  proSoft: '#2B2510',
};

// Backward-compatible static export for the dark "instrument" screens, which
// are theme-independent.
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

export const font = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
  hero: 64,
};
