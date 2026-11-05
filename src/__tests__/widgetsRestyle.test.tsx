/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import css from '../styles.css?raw';
import { AccountCard } from '../components/AccountCard';
import { Sparkline, AreaChart } from '../components/Sparkline';
import { StepperForm, type Step } from '../components/StepperForm';
import { themes, type ThemeName } from '../tokens/tokens';

const chan = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
const lum = (hex: string) => {
  const [r, g, b] = chan(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const modes: ThemeName[] = ['dark', 'light'];

describe('AccountCard widget', () => {
  it('renders widget classes, literal labels, mono id and balance', () => {
    const { container } = render(
      <AccountCard name="Checking" balance={10} accountNumber="•••• 4821" status={{ label: 'Active' }} />,
    );
    const root = screen.getByRole('group', { name: 'Checking account' });
    expect(root).toHaveClass('fds-card', 'fds-account-card');
    expect(screen.getByText('Balance')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(container.querySelector('.fds-account-card__id')).toHaveTextContent('•••• 4821');
    expect(container.querySelector('.fds-account-card__balance')).toBeInTheDocument();
  });
  it('omits the Account field without an account number', () => {
    render(<AccountCard name="X" balance={1} />);
    expect(screen.queryByText('Account')).not.toBeInTheDocument();
  });
  it('styles: 4px widget radius, 16px padding, flat (no gradient)', () => {
    expect(css).toMatch(/\.fds-card \{[^}]*radius-widget[^}]*\}/);
    expect(css).toMatch(/\.fds-card \{[^}]*space-lg\)/);
    expect(css).not.toMatch(/(linear|radial|conic)-gradient\(/);
    expect(css).toMatch(/\.fds-account-card__id \{[^}]*font-family-mono/);
    expect(css).toMatch(/\.fds-account-card__balance \{[^}]*font-family-mono/);
  });
  it.each(modes)('%s title, labels and id on widget surface >= 4.5:1', (m) => {
    const c = themes[m];
    expect(contrast(c.text, c.bgElevated)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.textMuted, c.bgElevated)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('StepperForm states', () => {
  const steps: Step[] = [
    { id: 'a', label: 'Identity', content: <div>A</div> },
    { id: 'b', label: 'Address', content: <div>B</div>, validate: () => false },
    { id: 'c', label: 'Review', content: <div>C</div> },
  ];
  it('marks complete with a check glyph and text, current with text, others not started', async () => {
    render(<StepperForm steps={steps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('✓');
    expect(items[0]).toHaveTextContent('(Complete)');
    expect(items[1]).toHaveTextContent('(Current)');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).toHaveTextContent('(Not started)');
  });
  it('shows an error glyph, visible text and an alert when validation fails; clears on Back', async () => {
    render(<StepperForm steps={steps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    const item = screen.getByText('Address').closest('li')!;
    expect(item).toHaveClass('fds-step--error');
    expect(item).toHaveTextContent('!');
    expect(item.querySelector('.fds-step__status')).toHaveTextContent('(Error)');
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it('supports a forced error prop', () => {
    render(<StepperForm steps={[{ ...steps[0], error: true }, steps[2]]} />);
    expect(screen.getByText('Identity').closest('li')).toHaveClass('fds-step--error');
  });
  it('keeps keyboard navigation via buttons with a focus ring', async () => {
    render(<StepperForm steps={steps} />);
    await userEvent.tab();
    // Back is disabled, so first tab stop is Next
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(css).toMatch(/\.fds-btn:focus-visible/);
  });
  it.each(modes)('%s step colours meet contrast', (m) => {
    const c = themes[m];
    expect(contrast(c.negative, c.negativeBg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.negative, c.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.brandText, c.brand)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.text, c.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.textMuted, c.bg)).toBeGreaterThanOrEqual(4.5);
    // Active border and chart line use the focus-ring accent (UI, 3:1) on both surfaces.
    expect(contrast(c.focusRing, c.bg)).toBeGreaterThanOrEqual(3);
    expect(contrast(c.focusRing, c.bgElevated)).toBeGreaterThanOrEqual(3);
  });
});

describe('Sparkline', () => {
  it('has an accessible name stating the trend in words', () => {
    render(<Sparkline data={[1, 2, 3]} />);
    expect(screen.getByRole('img', { name: /rising/ })).toBeInTheDocument();
  });
  it('honours a custom ariaLabel', () => {
    render(<Sparkline data={[1, 2]} ariaLabel="Balance trend" />);
    expect(screen.getByRole('img', { name: 'Balance trend' })).toBeInTheDocument();
  });
  it('encodes trend by marker shape, not colour alone', () => {
    const { container, rerender } = render(<Sparkline data={[1, 2, 3]} />);
    expect(container.querySelector('circle[data-trend="rising"]')).toBeInTheDocument();
    rerender(<Sparkline data={[3, 2, 1]} />);
    expect(container.querySelector('rect[data-trend="falling"]')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /falling/ })).toBeInTheDocument();
    rerender(<Sparkline data={[2, 2]} />);
    expect(container.querySelector('rect[data-trend="flat"]')).toBeInTheDocument();
  });
  it('draws a 1.5px line, no area by default, intent class', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} intent="negative" />);
    expect(container.querySelector('.fds-chart__line')).toHaveAttribute('stroke-width', '1.5');
    expect(container.querySelector('.fds-chart__area')).toBeNull();
    expect(container.querySelector('svg')).toHaveClass('fds-chart--negative');
  });
  it('AreaChart still renders the flat area, with no gradient', () => {
    const { container } = render(<AreaChart data={[1, 2, 3]} />);
    expect(container.querySelector('.fds-chart__area')).toBeInTheDocument();
    expect(container.querySelector('linearGradient')).toBeNull();
    expect(css).toMatch(/\.fds-chart__line \{[^}]*vector-effect: non-scaling-stroke/);
    expect(css).not.toMatch(/\.fds-chart__line \{[^}]*stroke-width/);
  });
  it.each(modes)('%s intent line colours >= 3:1 on widget surface', (m) => {
    const c = themes[m];
    for (const k of ['focusRing', 'positive', 'negative', 'warning'] as const) {
      expect(contrast(c[k], c.bgElevated)).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('Sparkline non-finite data', () => {
  it('filters NaN/Infinity before drawing and labelling', () => {
    const { container } = render(<Sparkline data={[1, NaN, 3, Infinity, 5]} />);
    expect(container.innerHTML).not.toContain('NaN');
    expect(container.innerHTML).not.toContain('Infinity');
    expect(screen.getByRole('img')).toHaveAccessibleName('Trend rising, from 1 to 5 over 3 points');
  });
  it('renders the empty state when nothing finite remains', () => {
    const { container } = render(<Sparkline data={[NaN, Infinity]} />);
    expect(container.querySelector('path')).toBeNull();
    expect(container.innerHTML).not.toContain('NaN');
    expect(screen.getByRole('img')).toHaveAccessibleName('Sparkline');
  });
});
