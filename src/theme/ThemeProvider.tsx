import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { type ThemeName } from '../tokens/tokens';
import { themeVars } from './cssVars';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Controlled or initial theme. Defaults to "light". */
  defaultTheme?: ThemeName;
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
  className,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme);

  useEffect(() => {
    setTheme(defaultTheme);
  }, [defaultTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    }),
    [theme],
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
      <div data-fds-theme={theme} className={className} style={style}>
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
