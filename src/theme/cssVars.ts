import {
  type SemanticColors,
  type ThemeName,
  type Accent,
  type AccentColors,
  accents,
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

/** Resolve an accent (preset name or custom object) to color roles. Unknown names fall back to blue. */
export function resolveAccent(accent: Accent | undefined, name: ThemeName): AccentColors {
  if (typeof accent === 'string') {
    return (Object.prototype.hasOwnProperty.call(accents, accent) ? accents[accent] : accents.blue)[name];
  }
  if (accent && typeof accent === 'object' && typeof accent.base === 'string' && accent.base) {
    return {
      brand: accent.base,
      brandHover: accent.hover ?? accent.base,
      brandText: accent.onAccent ?? '#ffffff',
      focusRing: accent.focusRing ?? accent.base,
    };
  }
  return accents.blue[name];
}

export function themeVars(name: ThemeName, accent?: Accent): Record<string, string> {
  const colors = { ...themes[name], ...resolveAccent(accent, name) };
  return { ...staticVars(), ...colorVars(colors) };
}
