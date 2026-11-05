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

const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** True for a strict hex colour: #rgb, #rrggbb or #rrggbbaa. */
export function isHexColor(v: unknown): v is string {
  return typeof v === 'string' && HEX_RE.test(v);
}

/** True for a known preset name or a custom accent whose every colour is a strict hex. */
export function isValidAccent(accent: unknown): accent is Accent {
  if (typeof accent === 'string') return Object.prototype.hasOwnProperty.call(accents, accent);
  if (!accent || typeof accent !== 'object') return false;
  const a = accent as Record<string, unknown>;
  if (!isHexColor(a.base)) return false;
  return (['hover', 'onAccent', 'focusRing'] as const).every((k) => a[k] === undefined || isHexColor(a[k]));
}

/** Resolve an accent (preset name or custom object) to color roles. Invalid input falls back to blue. */
export function resolveAccent(accent: Accent | undefined, name: ThemeName): AccentColors {
  if (!isValidAccent(accent)) return accents.blue[name];
  if (typeof accent === 'string') return accents[accent][name];
  return {
    brand: accent.base,
    brandHover: accent.hover ?? accent.base,
    brandText: accent.onAccent ?? '#ffffff',
    focusRing: accent.focusRing ?? accent.base,
  };
}

export function themeVars(name: ThemeName, accent?: Accent): Record<string, string> {
  const colors = { ...themes[name], ...resolveAccent(accent, name) };
  return { ...staticVars(), ...colorVars(colors) };
}
