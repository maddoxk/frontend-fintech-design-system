import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, type ButtonVariant } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { Field } from '../components/Field';
import { themes, type ThemeName } from '../tokens/tokens';

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

const mixBlack = (hex: string, p: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * (1 - p)).toString(16).padStart(2, '0'));
  return `#${ch.join('')}`;
};

const modes: ThemeName[] = ['dark', 'light'];
const intents = ['positive', 'negative', 'warning', 'info'] as const;

describe('badge text/tint contrast', () => {
  it.each(modes.flatMap((m) => intents.map((k) => [m, k] as const)))('%s %s text on tint >= 4.5:1', (m, k) => {
    const c = themes[m];
    expect(contrast(c[k], c[`${k}Bg` as const])).toBeGreaterThanOrEqual(4.5);
  });
  it.each(modes)('%s neutral text on its surface >= 4.5:1', (m) => {
    const c = themes[m];
    expect(contrast(c.textMuted, c.bgSubtleHover)).toBeGreaterThanOrEqual(4.5);
  });
  it.each(modes)('%s badge text on the page >= 4.5:1', (m) => {
    const c = themes[m];
    intents.forEach((k) => expect(contrast(c[k], c.bg)).toBeGreaterThanOrEqual(4.5));
  });
});

describe('filled button contrast', () => {
  it.each(modes)('%s danger/success/warning label (inverse text) >= 4.5:1', (m) => {
    const c = themes[m];
    (['negative', 'positive', 'warning'] as const).forEach((k) => {
      expect(contrast(c[k], c.textInverse)).toBeGreaterThanOrEqual(4.5);
    });
  });
  it.each(modes)('%s primary label and hover label >= 4.5:1', (m) => {
    const c = themes[m];
    expect(contrast(c.brand, c.brandText)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.brandHover, c.brandText)).toBeGreaterThanOrEqual(4.5);
  });
  it.each(modes)('%s intent labels hold >= 4.5:1 in rest, hover and active', (m) => {
    const c = themes[m];
    const fills = [
      [c.brand, c.brandHover, mixBlack(c.brandHover, 0.15), c.brandText],
      [c.positive, c.positiveHover, c.positiveActive, c.textInverse],
      [c.warning, c.warningHover, c.warningActive, c.textInverse],
      [c.negative, c.negativeHover, c.negativeActive, c.textInverse],
    ];
    fills.forEach(([rest, hover, active, label]) => {
      [rest, hover, active].forEach((f) => expect(contrast(f, label)).toBeGreaterThanOrEqual(4.5));
      expect(hover).not.toBe(rest);
      expect(active).not.toBe(hover);
    });
  });
  it.each(modes)('%s primary border (focus-ring colour) is >= 3:1 on page and widget surfaces', (m) => {
    const c = themes[m];
    expect(contrast(c.focusRing, c.bg)).toBeGreaterThanOrEqual(3);
    expect(contrast(c.focusRing, c.bgElevated)).toBeGreaterThanOrEqual(3);
  });
});

describe('restyled atom rendering', () => {
  it.each(['primary', 'default', 'secondary', 'success', 'warning', 'danger', 'ghost'] as ButtonVariant[])(
    'Button renders %s intent class',
    (v) => {
      render(<Button variant={v}>{v}</Button>);
      expect(screen.getByRole('button').className).toContain(`fds-btn--${v}`);
    },
  );

  it('StatusBadge always renders its text label, with the dot decorative', () => {
    const { container } = render(<StatusBadge tone="warning">Pending</StatusBadge>);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(container.querySelector('.fds-badge--warning')).not.toBeNull();
    expect(container.querySelector('.fds-badge__dot')).toHaveAttribute('aria-hidden', 'true');
  });

  it('Field exposes error and disabled state accessibly', () => {
    render(<Field label="Amount" error="Required" disabled />);
    const input = screen.getByLabelText('Amount');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.className).toContain('fds-input--invalid');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
});
