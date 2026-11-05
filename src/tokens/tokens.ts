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
  // Blueprint-style surfaces and intents (Palantir direction)
  bpPage: '#182026',
  bpSection: '#202B33',
  bpWidget: '#293742',
  bpWidgetHover: '#30404D',
  bpBorder: '#30404D',
  bpBorderStrong: '#394B59',
  bpLightPage: '#F5F8FA',
  bpLightPanel: '#EBF1F5',
  bpLightBorder: '#D8E1E8',
  bpLightBorderStrong: '#CED9E0',
  bpText: '#182026',
  bpTextDark: '#F5F8FA',
  bpTextMutedDark: '#A7B6C2',
  bpTextMuted: '#5C7080',
  bpBlue: '#137CBD',
  bpBlueHover: '#106BA3',
  bpGreen: '#0F9960',
  bpOrange: '#D9822B',
  bpRed: '#DB3737',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  /** 20px step of the 4/8/12/16/20/24 scale. */
  'lg-plus': '20px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
} as const;

export const radii = {
  /** Controls (buttons, inputs). */
  sm: '3px',
  /** Widgets (bordered panels). */
  md: '4px',
  /** Sections. */
  lg: '6px',
  full: '9999px',
  control: '3px',
  widget: '4px',
  section: '6px',
} as const;

/** Layout sizes. */
export const sizes = {
  controlHeight: '32px',
} as const;

/** Elevation: borders first, shadows only for widgets and overlays. */
export const shadows = {
  widget: '0 2px 6px rgba(0, 0, 0, 0.18)',
  overlay: '0 10px 24px rgba(0, 0, 0, 0.28)',
} as const;

export const typography = {
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontFamilyMono: "'SF Mono', 'Roboto Mono', Menlo, Consolas, monospace",
  fontSizeXs: '12px',
  fontSizeSm: '14px',
  fontSizeMd: '16px',
  fontSizeLg: '18px',
  fontSizeXl: '24px',
  /** Page title. */
  fontSizeTitle: '32px',
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
  /** Section surface (between page and widget). */
  bgSection: string;
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
  positiveHover: string;
  positiveActive: string;
  negativeHover: string;
  negativeActive: string;
  warningHover: string;
  warningActive: string;
  info: string;
  infoBg: string;
  focusRing: string;
}

export const lightColors: SemanticColors = {
  bg: palette.bpLightPage,
  bgElevated: palette.white,
  bgSection: palette.bpLightPanel,
  bgSubtleHover: palette.bpLightPanel,
  border: palette.bpLightBorder,
  borderStrong: palette.bpLightBorderStrong,
  text: palette.bpText,
  textMuted: palette.bpTextMuted,
  textInverse: palette.white,
  brand: palette.bpBlue,
  brandHover: palette.bpBlueHover,
  brandText: palette.white,
  // Contrast deviation #4: Blueprint intents #0F9960 / #DB3737 / #D9822B are only 2.9-4.3:1 as text on the
  // light page (#F5F8FA) and panel (#EBF1F5). Intent colours are used as text (.fds-field__error,
  // .fds-money--*, badges), so the light theme uses the darker Blueprint steps below (all >= 4.5:1 on page,
  // panel, white and the tinted *Bg). Dark theme intents are already >= 4.5:1. #DB3737 remains in palette.
  positive: '#0A6640',
  positiveBg: '#E1F5EC',
  negative: '#C23030',
  negativeBg: '#FCE8E8',
  warning: '#935610',
  warningBg: '#FBEBDC',
  // Filled-intent hover/active fills: light darkens (white label), dark lightens (dark label); all labels >= 4.5:1.
  positiveHover: '#095A38',
  positiveActive: '#085032',
  negativeHover: '#AB2A2A',
  negativeActive: '#972525',
  warningHover: '#814C0E',
  warningActive: '#73430C',
  // Light info text uses the darker Blueprint blue so it is >= 4.5:1 on its tint (#137CBD is 4.2:1).
  info: palette.bpBlueHover,
  infoBg: '#DDEEF8',
  focusRing: palette.bpBlue,
};

export const darkColors: SemanticColors = {
  bg: palette.bpPage,
  bgElevated: palette.bpWidget,
  bgSection: palette.bpSection,
  bgSubtleHover: palette.bpWidgetHover,
  border: palette.bpBorder,
  borderStrong: palette.bpBorderStrong,
  text: palette.bpTextDark,
  // Spec secondary #5C7080 is < 4.5:1 on the dark page; use the lighter Blueprint gray for text.
  textMuted: palette.bpTextMutedDark,
  textInverse: palette.bpPage,
  brand: palette.bpBlue,
  // Filled-button hover keeps white on-accent text >= 4.5:1, so it is the darker blue in both themes.
  brandHover: palette.bpBlueHover,
  brandText: palette.white,
  positive: '#3DCC91',
  positiveBg: '#0F3D2B',
  negative: '#FF7373',
  negativeBg: '#4A1B1B',
  warning: '#FFB366',
  warningBg: '#4A2E12',
  positiveHover: '#54D29E',
  positiveActive: '#68D7A9',
  negativeHover: '#FF8484',
  negativeActive: '#FF9292',
  warningHover: '#FFBC78',
  warningActive: '#FFC488',
  info: '#48AFF0',
  infoBg: '#10354F',
  focusRing: '#48AFF0',
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

/**
 * Build light/dark accent roles. Dark values are chosen so the brand colour is >= 3:1 against the dark
 * background while white on-accent text stays >= 4.5:1 against it.
 */
const accentPair = (
  light: { brand: string; hover: string },
  dark: { brand: string; hover: string; ring: string },
): Record<ThemeName, AccentColors> => ({
  light: { brand: light.brand, brandHover: light.hover, brandText: '#ffffff', focusRing: light.brand },
  dark: { brand: dark.brand, brandHover: dark.hover, brandText: '#ffffff', focusRing: dark.ring },
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
  indigo: accentPair(
    { brand: '#4f46e5', hover: '#4338ca' },
    { brand: '#5558e8', hover: '#4f46e5', ring: '#818cf8' },
  ),
  emerald: accentPair(
    { brand: '#047857', hover: '#065f46' },
    { brand: '#047857', hover: '#065f46', ring: '#34d399' },
  ),
  violet: accentPair(
    { brand: '#7c3aed', hover: '#6d28d9' },
    { brand: '#8550f2', hover: '#7c3aed', ring: '#a78bfa' },
  ),
  rose: accentPair(
    { brand: '#be123c', hover: '#9f1239' },
    { brand: '#cc2a56', hover: '#be123c', ring: '#fb7185' },
  ),
  graphite: accentPair(
    { brand: '#374151', hover: '#1f2937' },
    { brand: '#6b7280', hover: '#5b6472', ring: '#9ca3af' },
  ),
};
