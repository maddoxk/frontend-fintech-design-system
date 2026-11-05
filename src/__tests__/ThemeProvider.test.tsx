import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';

function ThemeReadout() {
  const { theme, mode, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="mode">{mode}</span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setTheme('system')}>system</button>
      <button onClick={() => setTheme('dark')}>dark</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('defaults to light and exposes CSS variables', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeReadout />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    const wrapper = container.querySelector('[data-fds-theme]') as HTMLElement;
    expect(wrapper).toHaveAttribute('data-fds-theme', 'light');
    expect(wrapper.style.getPropertyValue('--fds-color-bg')).toBeTruthy();
  });

  it('toggles between light and dark', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeReadout />
      </ThemeProvider>,
    );
    await userEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('throws when useTheme is used outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeReadout />)).toThrow(/ThemeProvider/);
    spy.mockRestore();
  });

  describe('system mode', () => {
    function mockMatchMedia(initial: boolean) {
      let listener: ((e: { matches: boolean }) => void) | undefined;
      const removeEventListener = vi.fn();
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: initial,
        addEventListener: (_: string, l: typeof listener) => {
          listener = l;
        },
        removeEventListener,
      })) as unknown as typeof window.matchMedia;
      return { fire: (m: boolean) => act(() => listener?.({ matches: m })), removeEventListener };
    }

    afterEach(() => {
      // @ts-expect-error cleanup of test mock
      delete window.matchMedia;
      window.localStorage.clear();
    });

    it('resolves from prefers-color-scheme and updates live', () => {
      const mm = mockMatchMedia(true);
      const { container, unmount } = render(
        <ThemeProvider defaultTheme="system">
          <ThemeReadout />
        </ThemeProvider>,
      );
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('mode')).toHaveTextContent('system');
      expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark');
      mm.fire(false);
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      unmount();
      expect(mm.removeEventListener).toHaveBeenCalled();
    });

    it('persists the mode when storageKey is set', async () => {
      mockMatchMedia(false);
      render(
        <ThemeProvider storageKey="k">
          <ThemeReadout />
        </ThemeProvider>,
      );
      await userEvent.click(screen.getByText('dark'));
      expect(window.localStorage.getItem('k')).toBe('dark');
    });

    it('restores a stored mode and does not persist without storageKey', async () => {
      window.localStorage.setItem('k', 'dark');
      const { unmount } = render(
        <ThemeProvider storageKey="k">
          <ThemeReadout />
        </ThemeProvider>,
      );
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      unmount();
      window.localStorage.clear();
      render(
        <ThemeProvider>
          <ThemeReadout />
        </ThemeProvider>,
      );
      await userEvent.click(screen.getByText('dark'));
      expect(window.localStorage.length).toBe(0);
    });

    it('ignores an invalid stored value', () => {
      window.localStorage.setItem('k', 'purple');
      render(
        <ThemeProvider storageKey="k" defaultTheme="dark">
          <ThemeReadout />
        </ThemeProvider>,
      );
      expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    });

    it('does not throw when setItem throws', async () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });
      render(
        <ThemeProvider storageKey="k">
          <ThemeReadout />
        </ThemeProvider>,
      );
      await userEvent.click(screen.getByText('dark'));
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      spy.mockRestore();
    });

    it('falls back to addListener/removeListener on old Safari', () => {
      const addListener = vi.fn();
      const removeListener = vi.fn();
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: true,
        addListener,
        removeListener,
      })) as unknown as typeof window.matchMedia;
      const { unmount } = render(
        <ThemeProvider defaultTheme="system">
          <ThemeReadout />
        </ThemeProvider>,
      );
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(addListener).toHaveBeenCalledTimes(1);
      unmount();
      expect(removeListener).toHaveBeenCalledWith(addListener.mock.calls[0][0]);
    });

    it('renders the default on first server render, ignoring stored value', async () => {
      window.localStorage.setItem('k', 'dark');
      const { renderToString } = await import('react-dom/server');
      // jsdom defines window, so React warns about useLayoutEffect on the server; irrelevant here.
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const html = renderToString(
        <ThemeProvider storageKey="k">
          <ThemeReadout />
        </ThemeProvider>,
      );
      errSpy.mockRestore();
      expect(html).toContain('data-fds-theme="light"');
    });
  });
});
