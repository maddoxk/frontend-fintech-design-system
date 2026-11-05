import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { type ThemeName } from '../tokens/tokens';
import { themeVars } from './cssVars';

/** Theme selection: an explicit theme, or "system" to follow the OS appearance. */
export type ThemeMode = ThemeName | 'system';

interface ThemeContextValue {
  /** Resolved theme (never "system"). */
  theme: ThemeName;
  /** The selected mode, which may be "system". */
  mode: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;
}

// useLayoutEffect avoids a flash after mount on the client; falls back to useEffect on the server.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const DARK_QUERY = '(prefers-color-scheme: dark)';

function isMode(v: unknown): v is ThemeMode {
  return v === 'light' || v === 'dark' || v === 'system';
}

function readStored(key: string | undefined): ThemeMode | undefined {
  if (!key) return undefined;
  try {
    const v = window.localStorage.getItem(key);
    return isMode(v) ? v : undefined;
  } catch {
    return undefined;
  }
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial mode: "light", "dark" or "system". Defaults to "light". */
  defaultTheme?: ThemeMode;
  /** localStorage key used to persist the chosen mode. Omit for no persistence. */
  storageKey?: string;
  /** When true, applies vars to the wrapping div as inline CSS custom properties. */
  className?: string;
}

/**
 * Provides design-token CSS custom properties and light/dark switching.
 * Wrap your app (or any subtree) with <ThemeProvider>.
 */
export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey,
  className,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultTheme);
  const [system, setSystem] = useState<ThemeName>('light');

  // Resolve the stored mode after mount so the first render matches the server.
  useIsoLayoutEffect(() => {
    setMode(readStored(storageKey) ?? defaultTheme);
  }, [defaultTheme, storageKey]);

  useIsoLayoutEffect(() => {
    if (mode !== 'system' || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const mql = window.matchMedia(DARK_QUERY);
    const onChange = (e: MediaQueryListEvent) => setSystem(e.matches ? 'dark' : 'light');
    setSystem(mql.matches ? 'dark' : 'light');
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    // Safari < 14
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, [mode]);

  const theme: ThemeName = mode === 'system' ? system : mode;

  const setTheme = useCallback(
    (m: ThemeMode) => {
      setMode(m);
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, m);
        } catch {
          /* storage unavailable */
        }
      }
    },
    [storageKey],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      setTheme,
      toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light'),
    }),
    [theme, mode, setTheme],
  );

  const style = useMemo(
    () =>
      ({
        ...themeVars(theme),
        background: 'var(--fds-color-bg)',
        color: 'var(--fds-color-text)',
        fontFamily: 'var(--fds-font-family)',
      }) as CSSProperties,
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-fds-theme={theme} data-theme={theme} className={className} style={style}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/** Access the current theme and setters. Must be used within a ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}
