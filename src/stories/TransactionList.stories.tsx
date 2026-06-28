import type { Meta, StoryObj } from '@storybook/react';
import { TransactionList } from '../components/TransactionList';

const meta: Meta<typeof TransactionList> = {
  title: 'Components/TransactionList',
  component: TransactionList,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof TransactionList>;

export const Default: Story = {
  args: {
    currency: 'USD',
    transactions: [
      { id: '1', merchant: 'Whole Foods Market', amount: -86.42, date: '2026-06-21', category: 'Groceries', icon: '🛒' },
      { id: '2', merchant: 'Payroll — Acme Inc.', amount: 3200.0, date: '2026-06-20', category: 'Income', icon: '💼' },
      { id: '3', merchant: 'Uber', amount: -18.75, date: '2026-06-19', category: 'Transport', icon: '🚗' },
      { id: '4', merchant: 'Netflix', amount: -15.49, date: '2026-06-18', category: 'Subscriptions', icon: '🎬' },
      { id: '5', merchant: 'Refund — Amazon', amount: 41.0, date: '2026-06-17', category: 'Refund', icon: '📦' },
    ],
  },
};
