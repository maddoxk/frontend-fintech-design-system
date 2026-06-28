import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MoneyAmount } from '../components/MoneyAmount';
import { TransactionList } from '../components/TransactionList';
import { StatusBadge } from '../components/StatusBadge';

describe('MoneyAmount', () => {
  it('formats and labels the amount', () => {
    render(<MoneyAmount value={2500} currency="USD" locale="en-US" />);
    expect(screen.getByText('$2,500.00')).toBeInTheDocument();
  });

  it('colorizes negative amounts', () => {
    render(<MoneyAmount value={-5} currency="USD" locale="en-US" colorize />);
    const el = screen.getByText('-$5.00');
    expect(el.className).toContain('fds-money--negative');
  });
});

describe('TransactionList', () => {
  it('renders an accessible list of transactions', () => {
    render(
      <TransactionList
        locale="en-US"
        transactions={[
          { id: 'a', merchant: 'Coffee Bar', amount: -4.5, date: '2026-02-01' },
          { id: 'b', merchant: 'Payroll', amount: 3200, date: '2026-02-02' },
        ]}
      />,
    );
    const list = screen.getByRole('list', { name: 'Transactions' });
    expect(list).toBeInTheDocument();
    expect(screen.getByText('Coffee Bar')).toBeInTheDocument();
    expect(screen.getByText('Payroll')).toBeInTheDocument();
  });
});

describe('StatusBadge', () => {
  it('renders with a tone class', () => {
    render(<StatusBadge tone="positive">Active</StatusBadge>);
    const badge = screen.getByText('Active');
    expect(badge.className).toContain('fds-badge--positive');
  });
});
