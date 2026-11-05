import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Page } from '../components/Page';
import { Section } from '../components/Section';
import { Widget } from '../components/Widget';
import { DataTable, type Column } from '../components/DataTable';
import { AccountCard } from '../components/AccountCard';
import { StatusBadge } from '../components/StatusBadge';
import { MoneyAmount } from '../components/MoneyAmount';
import { Button } from '../components/Button';

interface Row {
  id: string;
  symbol: string;
  shares: number;
  value: number;
  status: 'Open' | 'Closed';
}

const rows: Row[] = [
  { id: '1', symbol: 'AAPL', shares: 50, value: 10620, status: 'Open' },
  { id: '2', symbol: 'MSFT', shares: 20, value: 9022, status: 'Open' },
  { id: '3', symbol: 'TSLA', shares: 15, value: 2683.5, status: 'Closed' },
];

const columns: Column<Row>[] = [
  { key: 'symbol', header: 'Symbol' },
  { key: 'shares', header: 'Shares', numeric: true },
  { key: 'value', header: 'Market value', numeric: true, render: (r) => <MoneyAmount value={r.value} /> },
  {
    key: 'status',
    header: 'Status',
    sortable: false,
    render: (r) => <StatusBadge tone={r.status === 'Open' ? 'positive' : 'neutral'}>{r.status}</StatusBadge>,
  },
];

function Dashboard() {
  return (
    <Page title="Portfolio overview" as="main" actions={<Button variant="primary">New order</Button>}>
      <Section title="Accounts" columns={2} actions={<Button variant="ghost">Manage</Button>}>
        {/* AccountCard is itself a bordered widget-style card with its own title: place it directly in the grid. */}
        <AccountCard
          name="Everyday Checking"
          balance={8421.55}
          accountNumber="•••• 4821"
          status={{ label: 'Active', tone: 'positive' }}
        />
        <AccountCard
          name="Brokerage"
          balance={152930.18}
          accountNumber="•••• 0093"
          status={{ label: 'Review', tone: 'warning' }}
        />
      </Section>
      <Section title="Holdings">
        <Widget title="Positions" headingLevel={3}>
          <DataTable columns={columns} data={rows} rowKey={(r) => r.id} caption="Portfolio holdings" />
        </Widget>
      </Section>
    </Page>
  );
}

const meta: Meta<typeof Page> = {
  title: 'Components/Layout',
  component: Page,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Page>;

export const DashboardDark: Story = {
  render: () => (
    <ThemeProvider defaultTheme="dark">
      <Dashboard />
    </ThemeProvider>
  ),
};

export const DashboardLight: Story = {
  render: () => (
    <ThemeProvider defaultTheme="light">
      <Dashboard />
    </ThemeProvider>
  ),
};

export const WidgetOnly: Story = {
  render: () => (
    <ThemeProvider defaultTheme="dark">
      <Widget title="Balance" actions={<Button variant="ghost">Details</Button>}>
        <MoneyAmount value={1234.56} />
      </Widget>
    </ThemeProvider>
  ),
};
