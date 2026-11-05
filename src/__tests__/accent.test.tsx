import { useState } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';
import { themeVars, resolveAccent } from '../theme/cssVars';
import { accents, themes, type AccentName, type ThemeName } from '../tokens/tokens';

const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('accent presets', () => {
  const names = Object.keys(accents) as AccentName[];
  const modes: ThemeName[] = ['light', 'dark'];

  it.each(names.flatMap((n) => modes.map((m) => [n, m] as const)))(
    '%s/%s on-accent text has >= 4.5:1 contrast',
    (n, m) => {
      const c = accents[n][m];
      expect(contrast(c.brand, c.brandText)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each(names.flatMap((n) => modes.map((m) => [n, m] as const)))(
    '%s/%s brand has >= 3:1 contrast against the theme background',
    (n, m) => {
      expect(contrast(accents[n][m].brand, themes[m].bg)).toBeGreaterThanOrEqual(3);
    },
  );

  it('falls back to blue for invalid custom accents', () => {
    const bad = ['x', '', 'red', '#12', '#ggg', '#1234567', 'red;background:url(x)', '#fff;x', 'url(http://e)'];
    bad.forEach((b) => {
      expect(resolveAccent({ base: b }, 'light')).toEqual(accents.blue.light);
      expect(resolveAccent({ base: '#112233', hover: b }, 'dark')).toEqual(accents.blue.dark);
      expect(resolveAccent({ base: '#112233', onAccent: b }, 'dark')).toEqual(accents.blue.dark);
      expect(resolveAccent({ base: '#112233', focusRing: b }, 'dark')).toEqual(accents.blue.dark);
    });
    expect(resolveAccent({ base: '#abc' }, 'light').brand).toBe('#abc');
    expect(resolveAccent({ base: '#aabbccdd' }, 'light').brand).toBe('#aabbccdd');
  });

  it('default output is identical to the theme vars', () => {
    modes.forEach((m) => {
      const base = themeVars(m);
      expect(themeVars(m, 'blue')).toEqual(base);
      expect(Object.keys(themeVars(m, 'rose'))).toEqual(Object.keys(base));
      expect(base['--fds-color-brand']).toBe(themes[m].brand);
    });
  });

  it('falls back to blue for unknown names', () => {
    expect(resolveAccent('nope' as AccentName, 'light')).toEqual(accents.blue.light);
    expect(() => resolveAccent(undefined, 'dark')).not.toThrow();
  });
});

function Readout() {
  const { accent, setAccent } = useTheme();
  return (
    <>
      <span data-testid="accent">{typeof accent === 'string' ? accent : accent.base}</span>
      <button onClick={() => setAccent('violet')}>violet</button>
    </>
  );
}

describe('ThemeProvider accent', () => {
  beforeEach(() => window.localStorage.clear());

  it('applies presets and custom accents, and nests', () => {
    const { container } = render(
      <ThemeProvider accent="emerald">
        <ThemeProvider accent={{ base: '#112233', onAccent: '#fefefe' }} className="inner">
          <Readout />
        </ThemeProvider>
      </ThemeProvider>,
    );
    const [outer, inner] = Array.from(container.querySelectorAll('[data-fds-theme]')) as HTMLElement[];
    expect(outer.style.getPropertyValue('--fds-color-brand')).toBe(accents.emerald.light.brand);
    expect(inner.style.getPropertyValue('--fds-color-brand')).toBe('#112233');
    expect(inner.style.getPropertyValue('--fds-color-brand-text')).toBe('#fefefe');
  });

  it('persists the accent with storageKey', async () => {
    render(
      <ThemeProvider storageKey="k">
        <Readout />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('accent')).toHaveTextContent('blue');
    await userEvent.click(screen.getByText('violet'));
    expect(screen.getByTestId('accent')).toHaveTextContent('violet');
    expect(window.localStorage.getItem('k:accent')).toBe('violet');
  });

  it('restores a stored accent after mount', () => {
    window.localStorage.setItem('k:accent', 'rose');
    render(
      <ThemeProvider storageKey="k">
        <Readout />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('accent')).toHaveTextContent('rose');
  });

  it('ignores invalid accent props and injection-like values', () => {
    const { container } = render(
      <ThemeProvider accent={{ base: 'red; background:url(x)' }}>
        <Readout />
      </ThemeProvider>,
    );
    const el = container.querySelector('[data-fds-theme]') as HTMLElement;
    expect(el.style.getPropertyValue('--fds-color-brand')).toBe(accents.blue.light.brand);
  });

  it.each([
    '{"base":"x"}',
    '{"base":"#fff;background:url(x)"}',
    '{"base":"url(x)"}',
    '{"base":"#112233","hover":"x;y"}',
    '{bad json',
    'null',
    'nope',
  ])('falls back to blue for bad stored accent %s', (stored) => {
    window.localStorage.setItem('k:accent', stored);
    const { container } = render(
      <ThemeProvider storageKey="k">
        <Readout />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('accent')).toHaveTextContent('blue');
    const el = container.querySelector('[data-fds-theme]') as HTMLElement;
    expect(el.style.getPropertyValue('--fds-color-brand')).toBe(accents.blue.light.brand);
  });

  it('keeps a setAccent choice across parent re-renders with an equivalent inline accent', async () => {
    function Parent() {
      const [n, setN] = useState(0);
      return (
        <>
          <button onClick={() => setN(n + 1)}>rerender</button>
          <ThemeProvider storageKey="k" accent={{ base: '#112233' }}>
            <Readout />
          </ThemeProvider>
        </>
      );
    }
    render(<Parent />);
    expect(screen.getByTestId('accent')).toHaveTextContent('#112233');
    await userEvent.click(screen.getByText('violet'));
    await userEvent.click(screen.getByText('rerender'));
    expect(screen.getByTestId('accent')).toHaveTextContent('violet');
  });
});
