import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, type Column } from '../components/DataTable';
import { MoneyAmount } from '../components/MoneyAmount';
import { TransactionList } from '../components/TransactionList';
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
const mix = (a: string, b: string, p: number) => {
  const [x, y] = [chan(a), chan(b)];
  return `#${x.map((v, i) => Math.round(v * p + y[i] * (1 - p)).toString(16).padStart(2, '0')).join('')}`;
};
const modes: ThemeName[] = ['dark', 'light'];

describe('data surfaces contrast', () => {
  it.each(modes)('%s header, row, hover and selected text >= 4.5:1', (m) => {
    const c = themes[m];
    expect(contrast(c.textMuted, c.bgSection)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.text, c.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.text, c.bgSection)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.text, mix(c.brand, c.bg, 0.1))).toBeGreaterThanOrEqual(4.5);
  });
  it.each(modes)('%s intent amounts on row, hover and selected >= 4.5:1', (m) => {
    const c = themes[m];
    for (const k of ['positive', 'negative'] as const) {
      expect(contrast(c[k], c.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c[k], c.bgSection)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c[k], mix(c.brand, c.bg, 0.1))).toBeGreaterThanOrEqual(4.5);
    }
  });
  it.each(modes)('%s selected-row marker (brand) >= 3:1 on the row surface', (m) => {
    const c = themes[m];
    expect(contrast(c.brand, c.bg)).toBeGreaterThanOrEqual(3);
  });
});

describe('MoneyAmount state is not colour-only', () => {
  it('adds a direction glyph and sign when colorized', () => {
    const { container } = render(
      <>
        <MoneyAmount value={5} locale="en-US" colorize showSign />
        <MoneyAmount value={-5} locale="en-US" colorize showSign />
      </>,
    );
    const icons = container.querySelectorAll('.fds-money__icon');
    expect(icons).toHaveLength(2);
    expect(icons[0].textContent).toBe('▲');
    expect(icons[1].textContent).toBe('▼');
    expect(screen.getByText('+$5.00')).toBeInTheDocument();
    expect(screen.getByText('-$5.00')).toBeInTheDocument();
  });
  it('shows the glyph without showSign, and none when not colorized', () => {
    const { container } = render(
      <>
        <MoneyAmount value={5} locale="en-US" colorize />
        <MoneyAmount value={-5} locale="en-US" />
      </>,
    );
    expect(container.querySelectorAll('.fds-money__icon')).toHaveLength(1);
  });
});

interface Row {
  id: string;
  name: string;
  amount: number;
}
const cols: Column<Row>[] = [
  { key: 'name', header: 'Name' },
  { key: 'amount', header: 'Amount', numeric: true },
];
const rows: Row[] = [
  { id: '1', name: 'A', amount: 1 },
  { id: '2', name: 'B', amount: 2 },
];

describe('DataTable restyle', () => {
  it('marks numeric header/cells for right-aligned monospace numerals', () => {
    const { container } = render(<DataTable columns={cols} data={rows} rowKey={(r) => r.id} />);
    expect(container.querySelector('th.fds-th--numeric')).not.toBeNull();
    expect(container.querySelectorAll('td.fds-td--numeric')).toHaveLength(2);
    expect(container.querySelector('td:not(.fds-td--numeric)')).not.toBeNull();
  });
  it('flags selected rows and supports row click', () => {
    let clicked = '';
    render(
      <DataTable
        columns={cols}
        data={rows}
        rowKey={(r) => r.id}
        selectedKeys={['2']}
        onRowClick={(r) => (clicked = r.id)}
      />,
    );
    const trs = screen.getAllByRole('row').slice(1);
    expect(trs[0]).toHaveAttribute('aria-selected', 'false');
    expect(trs[1]).toHaveAttribute('aria-selected', 'true');
    trs[0].click();
    expect(clicked).toBe('1');
  });
  it('clickable rows are keyboard focusable and activate with Enter and Space', async () => {
    const clicked: string[] = [];
    render(<DataTable columns={cols} data={rows} rowKey={(r) => r.id} onRowClick={(r) => clicked.push(r.id)} />);
    const trs = screen.getAllByRole('row').slice(1);
    expect(trs[0]).toHaveAttribute('tabindex', '0');
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    expect(trs[0]).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(clicked).toEqual(['1', '1']);
    await userEvent.tab();
    expect(trs[1]).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(clicked).toEqual(['1', '1', '2']);
  });
  it('rows without onRowClick are not focusable', () => {
    render(<DataTable columns={cols} data={rows} rowKey={(r) => r.id} />);
    for (const tr of screen.getAllByRole('row').slice(1)) expect(tr).not.toHaveAttribute('tabindex');
  });
  it('defaults virtualized row height to the compact 32px', () => {
    const many = Array.from({ length: 100 }, (_, i) => ({ id: String(i), name: 'n', amount: i }));
    const { container } = render(<DataTable columns={cols} data={many} rowKey={(r) => r.id} virtualized />);
    const tr = container.querySelector<HTMLElement>('tbody tr:not([aria-hidden])');
    expect(tr?.style.height).toBe('32px');
  });
});

describe('TransactionList status', () => {
  it('shows StatusBadge with its text label', () => {
    render(
      <TransactionList
        locale="en-US"
        transactions={[
          { id: 'a', merchant: 'Shop', amount: -4, date: '2026-02-01', status: 'Pending', statusTone: 'warning' },
        ]}
      />,
    );
    expect(screen.getByText('Pending').className).toContain('fds-badge--warning');
  });
});
