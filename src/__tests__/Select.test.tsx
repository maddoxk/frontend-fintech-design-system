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

describe('Select placeholder, options and groups', () => {
  it('renders a disabled, initially selected placeholder', () => {
    render(<Select label="C" placeholder="Pick" options={opts} />);
    const ph = screen.getByRole('option', { name: 'Pick' }) as HTMLOptionElement;
    expect(ph).toBeDisabled();
    expect(ph.value).toBe('');
    expect(ph.selected).toBe(true);
    expect(screen.getByLabelText('C')).toHaveValue('');
  });
  it('placeholder is selected when controlled value is empty', () => {
    render(<Select label="C" placeholder="Pick" value="" onChange={() => {}} options={opts} />);
    expect((screen.getByRole('option', { name: 'Pick' }) as HTMLOptionElement).selected).toBe(true);
  });
  it('user cannot select the placeholder and it hides after a choice', async () => {
    const onChange = vi.fn();
    render(<Select label="C" placeholder="Pick" options={opts} onChange={onChange} />);
    const sel = screen.getByLabelText('C');
    const ph = screen.getByRole('option', { name: 'Pick', hidden: true });
    expect(ph).not.toHaveAttribute('hidden');
    await userEvent.selectOptions(sel, 'Pick').catch(() => {});
    expect(sel).toHaveValue('');
    await userEvent.selectOptions(sel, 'eur');
    expect(sel).toHaveValue('eur');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(ph).toHaveAttribute('hidden');
  });
  it('required with placeholder is invalid until a real option is chosen', async () => {
    render(<Select label="C" required placeholder="Pick" options={opts} />);
    const sel = screen.getByLabelText(/C/) as HTMLSelectElement;
    expect(sel.checkValidity()).toBe(false);
    await userEvent.selectOptions(sel, 'usd');
    expect(sel.checkValidity()).toBe(true);
  });
  it('placeholder works with option children', () => {
    render(
      <Select label="C" placeholder="Pick">
        <option value="a">A</option>
      </Select>,
    );
    expect(screen.getAllByRole('option')[0]).toHaveTextContent('Pick');
  });
  it('options shorthand marks disabled options and they cannot be chosen', async () => {
    render(<Select label="C" options={opts} />);
    expect(screen.getByRole('option', { name: 'Pound' })).toBeDisabled();
    expect(screen.getByRole('option', { name: 'Euro' })).toBeEnabled();
    const sel = screen.getByLabelText('C');
    await userEvent.selectOptions(sel, 'gbp').catch(() => {});
    expect(sel).not.toHaveValue('gbp');
  });
  it('renders optgroup children', async () => {
    render(
      <Select label="C">
        <optgroup label="Cash">
          <option value="chk">Checking</option>
        </optgroup>
        <optgroup label="Invest">
          <option value="brk">Brokerage</option>
        </optgroup>
      </Select>,
    );
    expect(screen.getByRole('group', { name: 'Cash' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Invest' })).toContainElement(
      screen.getByRole('option', { name: 'Brokerage' }),
    );
    await userEvent.selectOptions(screen.getByLabelText('C'), 'brk');
    expect(screen.getByLabelText('C')).toHaveValue('brk');
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
