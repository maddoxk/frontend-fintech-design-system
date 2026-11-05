import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../components/Select';
import { themes, type ThemeName } from '../tokens/tokens';

const opts = [
  { value: 'usd', label: 'US Dollar' },
  { value: 'eur', label: 'Euro' },
  { value: 'gbp', label: 'Pound', disabled: true },
];

describe('Select', () => {
  it('renders a labelled select with options', () => {
    render(<Select label="Currency" options={opts} />);
    const sel = screen.getByLabelText('Currency');
    expect(sel.tagName).toBe('SELECT');
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });
  it('renders children options', () => {
    render(
      <Select label="Kind">
        <option value="a">A</option>
      </Select>,
    );
    expect(screen.getByRole('option', { name: 'A' })).toBeInTheDocument();
  });
  it('describes by hint', () => {
    render(<Select label="C" hint="Pick one" options={opts} />);
    const sel = screen.getByLabelText('C');
    expect(sel).toHaveAccessibleDescription('Pick one');
    expect(sel).not.toHaveAttribute('aria-invalid');
  });
  it('error is text with alert role, aria-invalid, and replaces hint', () => {
    render(<Select label="C" hint="Pick one" error="Required choice" options={opts} />);
    const sel = screen.getByLabelText('C');
    expect(sel).toHaveAttribute('aria-invalid', 'true');
    expect(sel).toHaveAccessibleDescription('Required choice');
    expect(screen.getByRole('alert')).toHaveTextContent('Required choice');
    expect(screen.queryByText('Pick one')).toBeNull();
  });
  it('required sets aria-required and required', () => {
    render(<Select label="C" required options={opts} />);
    const sel = screen.getByLabelText(/C/);
    expect(sel).toHaveAttribute('aria-required', 'true');
    expect(sel).toBeRequired();
  });
  it('disabled', () => {
    render(<Select label="C" disabled options={opts} />);
    expect(screen.getByLabelText('C')).toBeDisabled();
  });
  it('changes value via userEvent.selectOptions', async () => {
    const onChange = vi.fn();
    render(<Select label="C" options={opts} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByLabelText('C'), 'eur');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('C')).toHaveValue('eur');
  });
  it('forwards className, native props, id and ref', () => {
    const ref = { current: null as HTMLSelectElement | null };
    render(<Select label="C" id="cur" className="extra" name="cur" data-x="1" ref={ref} options={opts} />);
    const sel = screen.getByLabelText('C');
    expect(sel).toHaveClass('fds-input', 'fds-select', 'extra');
    expect(sel).toHaveAttribute('id', 'cur');
    expect(sel).toHaveAttribute('name', 'cur');
    expect(sel).toHaveAttribute('data-x', '1');
    expect(ref.current).toBe(sel);
  });
});

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

describe('control border contrast (>= 3:1)', () => {
  const modes: ThemeName[] = ['dark', 'light'];
  it.each(modes)('%s borderControl vs page, section and widget surfaces', (m) => {
    const c = themes[m];
    [c.bg, c.bgSection, c.bgElevated].forEach((surface) => {
      expect(contrast(c.borderControl, surface)).toBeGreaterThanOrEqual(3);
    });
  });
});
