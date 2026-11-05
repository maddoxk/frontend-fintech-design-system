/**
 * Design tokens for the fintech design system.
 * These are the single source of truth for color, spacing, typography and radius.
 * Themes (light/dark) are emitted as CSS custom properties by the ThemeProvider.
 */

export const palette = {
  // Brand
  brand50: '#eef4ff',
  brand100: '#d9e6ff',
  brand500: '#2563eb',
  brand600: '#1d4ed8',
  brand700: '#1e40af',
  // Semantic
  positive: '#16a34a',
  positiveBg: '#dcfce7',
  negative: '#dc2626',
  negativeBg: '#fee2e2',
  warning: '#d97706',
  warningBg: '#fef3c7',
  info: '#0891b2',
  infoBg: '#cffafe',
  // Neutral
  white: '#ffffff',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
  gray950: '#020617',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
} as const;

export const radii = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;

export const typography = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontFamilyMono:
    "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
  fontSizeXs: '12px',
  fontSizeSm: '14px',
  fontSizeMd: '16px',
  fontSizeLg: '18px',
  fontSizeXl: '24px',
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
} as const;

export type ThemeName = 'light' | 'dark';

/** Semantic color roles resolved per theme. */
export interface SemanticColors {
  bg: string;
  bgElevated: string;
  bgSubtleHover: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textInverse: string;
  brand: string;
  brandHover: string;
  brandText: string;
  positive: string;
  positiveBg: string;
  negative: string;
  negativeBg: string;
  warning: string;
  warningBg: string;
  info: string;
  infoBg: string;
  focusRing: string;
}

export const lightColors: SemanticColors = {
  bg: palette.white,
  bgElevated: palette.white,
  bgSubtleHover: palette.gray100,
  border: palette.gray200,
  borderStrong: palette.gray300,
  text: palette.gray900,
  textMuted: palette.gray500,
  textInverse: palette.white,
  brand: palette.brand500,
  brandHover: palette.brand600,
  brandText: palette.white,
  positive: palette.positive,
  positiveBg: palette.positiveBg,
  negative: palette.negative,
  negativeBg: palette.negativeBg,
  warning: palette.warning,
  warningBg: palette.warningBg,
  info: palette.info,
  infoBg: palette.infoBg,
  focusRing: palette.brand500,
};

export const darkColors: SemanticColors = {
  bg: palette.gray950,
  bgElevated: palette.gray900,
  bgSubtleHover: palette.gray800,
  border: palette.gray800,
  borderStrong: palette.gray700,
  text: palette.gray100,
  textMuted: palette.gray400,
  textInverse: palette.gray950,
  brand: palette.brand500,
  brandHover: palette.brand100,
  brandText: palette.white,
  positive: '#4ade80',
  positiveBg: '#14532d',
  negative: '#f87171',
  negativeBg: '#7f1d1d',
  warning: '#fbbf24',
  warningBg: '#78350f',
  info: '#22d3ee',
  infoBg: '#164e63',
  focusRing: '#60a5fa',
};

export const themes: Record<ThemeName, SemanticColors> = {
  light: lightColors,
  dark: darkColors,
};

/** The semantic color roles an accent controls. */
export type AccentColors = Pick<SemanticColors, 'brand' | 'brandHover' | 'brandText' | 'focusRing'>;

export type AccentName = 'blue' | 'indigo' | 'emerald' | 'violet' | 'rose' | 'graphite';

/** Custom accent: only `base` is required; the rest fall back to sensible values. */
export interface CustomAccent {
  base: string;
  hover?: string;
  /** Text/icon color drawn on top of the accent. Defaults to white. */
  onAccent?: string;
  focusRing?: string;
}

export type Accent = AccentName | CustomAccent;

const accentPair = (brand: string, hover: string, ringDark: string): Record<ThemeName, AccentColors> => ({
  light: { brand, brandHover: hover, brandText: '#ffffff', focusRing: brand },
  dark: { brand, brandHover: hover, brandText: '#ffffff', focusRing: ringDark },
});

/** Accent presets. `blue` mirrors the default theme values exactly. */
export const accents: Record<AccentName, Record<ThemeName, AccentColors>> = {
  blue: {
    light: {
      brand: lightColors.brand,
      brandHover: lightColors.brandHover,
      brandText: lightColors.brandText,
      focusRing: lightColors.focusRing,
    },
    dark: {
      brand: darkColors.brand,
      brandHover: darkColors.brandHover,
      brandText: darkColors.brandText,
      focusRing: darkColors.focusRing,
    },
  },
  indigo: accentPair('#4f46e5', '#4338ca', '#818cf8'),
  emerald: accentPair('#047857', '#065f46', '#34d399'),
  violet: accentPair('#7c3aed', '#6d28d9', '#a78bfa'),
  rose: accentPair('#be123c', '#9f1239', '#fb7185'),
  graphite: accentPair('#374151', '#1f2937', '#9ca3af'),
};
