import type { Meta, StoryObj } from '@storybook/react';
import { AccountCard } from '../components/AccountCard';
import { Sparkline } from '../components/Sparkline';

const meta: Meta<typeof AccountCard> = {
  title: 'Components/AccountCard',
  component: AccountCard,
  tags: ['autodocs'],
  args: {
    name: 'Everyday Checking',
    balance: 8421.55,
    currency: 'USD',
    accountNumber: '•••• 4821',
    status: { label: 'Active', tone: 'positive' },
  },
};
export default meta;

type Story = StoryObj<typeof AccountCard>;

export const Default: Story = {};

export const WithTrailingChart: Story = {
  args: {
    name: 'Brokerage',
    balance: 152930.18,
    accountNumber: '•••• 0093',
    status: { label: '+3.2% today', tone: 'positive' },
    trailing: <Sparkline data={[10, 12, 9, 14, 13, 18, 22, 21, 26]} width={120} height={36} />,
  },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
      <AccountCard name="Everyday Checking" balance={8421.55} accountNumber="•••• 4821" status={{ label: 'Active', tone: 'positive' }} />
      <AccountCard name="High-Yield Savings" balance={42100.0} accountNumber="•••• 7732" status={{ label: '4.30% APY', tone: 'info' }} />
      <AccountCard name="Credit Card" balance={-1284.9} accountNumber="•••• 1199" status={{ label: 'Due Jul 3', tone: 'warning' }} />
    </div>
  ),
};
