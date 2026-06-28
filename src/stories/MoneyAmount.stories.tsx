import type { Meta, StoryObj } from '@storybook/react';
import { MoneyAmount } from '../components/MoneyAmount';

const meta: Meta<typeof MoneyAmount> = {
  title: 'Components/MoneyAmount',
  component: MoneyAmount,
  tags: ['autodocs'],
  args: { value: 1234.56, currency: 'USD', colorize: false, showSign: false },
  argTypes: {
    currency: { control: 'select', options: ['USD', 'EUR', 'GBP', 'JPY', 'BRL'] },
  },
};
export default meta;

type Story = StoryObj<typeof MoneyAmount>;

export const Default: Story = {};
export const Gain: Story = { args: { value: 482.19, colorize: true, showSign: true } };
export const Loss: Story = { args: { value: -91.4, colorize: true, showSign: true } };
export const Currencies: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 6, fontSize: 18 }}>
      <MoneyAmount value={1999.5} currency="USD" />
      <MoneyAmount value={1999.5} currency="EUR" locale="de-DE" />
      <MoneyAmount value={1999.5} currency="GBP" locale="en-GB" />
      <MoneyAmount value={1999.5} currency="JPY" locale="ja-JP" />
      <MoneyAmount value={1999.5} currency="BRL" locale="pt-BR" />
    </div>
  ),
};
