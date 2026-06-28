import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';

function ThemeReadout() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
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
});
