import {
  type SemanticColors,
  type ThemeName,
  themes,
  spacing,
  radii,
  typography,
} from '../tokens/tokens';

const camelToKebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** Build the CSS-variable map for a given theme's semantic colors. */
export function colorVars(colors: SemanticColors): Record<string, string> {
  const vars: Record<string, string> = {};
  (Object.keys(colors) as (keyof SemanticColors)[]).forEach((key) => {
    vars[`--fds-color-${camelToKebab(String(key))}`] = colors[key];
  });
  return vars;
}

/** Static (theme-independent) tokens: spacing, radii, typography. */
export function staticVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  Object.entries(spacing).forEach(([k, v]) => {
    vars[`--fds-space-${k}`] = v;
  });
  Object.entries(radii).forEach(([k, v]) => {
    vars[`--fds-radius-${k}`] = v;
  });
  Object.entries(typography).forEach(([k, v]) => {
    vars[`--fds-${camelToKebab(k)}`] = String(v);
  });
  return vars;
}

export function themeVars(name: ThemeName): Record<string, string> {
  return { ...staticVars(), ...colorVars(themes[name]) };
}
