import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, type Column } from '../components/DataTable';
import { MoneyAmount } from '../components/MoneyAmount';
import { StatusBadge } from '../components/StatusBadge';

interface Row {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  price: number;
  value: number;
  status: 'Open' | 'Closed';
}

const rows: Row[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', shares: 50, price: 212.4, value: 10620, status: 'Open' },
  { id: '2', symbol: 'MSFT', name: 'Microsoft', shares: 20, price: 451.1, value: 9022, status: 'Open' },
  { id: '3', symbol: 'TSLA', name: 'Tesla', shares: 15, price: 178.9, value: 2683.5, status: 'Closed' },
  { id: '4', symbol: 'NVDA', name: 'NVIDIA', shares: 8, price: 1201.3, value: 9610.4, status: 'Open' },
  { id: '5', symbol: 'AMZN', name: 'Amazon', shares: 12, price: 189.2, value: 2270.4, status: 'Open' },
];

const columns: Column<Row>[] = [
  { key: 'symbol', header: 'Symbol' },
  { key: 'name', header: 'Name' },
  { key: 'shares', header: 'Shares', numeric: true },
  { key: 'price', header: 'Price', numeric: true, render: (r) => <MoneyAmount value={r.price} /> },
  { key: 'value', header: 'Market value', numeric: true, render: (r) => <MoneyAmount value={r.value} /> },
  {
    key: 'status',
    header: 'Status',
    sortable: false,
    render: (r) => <StatusBadge tone={r.status === 'Open' ? 'positive' : 'neutral'}>{r.status}</StatusBadge>,
  },
];

const meta: Meta<typeof DataTable<Row>> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DataTable<Row>>;

export const Sortable: Story = {
  args: {
    columns,
    data: rows,
    rowKey: (r: Row) => r.id,
    caption: 'Portfolio holdings (click a header to sort)',
  },
};

const bigRows: Row[] = Array.from({ length: 1000 }, (_, i) => {
  const price = +(50 + Math.random() * 500).toFixed(2);
  const shares = 1 + Math.floor(Math.random() * 100);
  return {
    id: String(i),
    symbol: `T${i.toString().padStart(4, '0')}`,
    name: `Holding ${i}`,
    shares,
    price,
    value: +(price * shares).toFixed(2),
    status: i % 3 === 0 ? 'Closed' : 'Open',
  };
});

export const Virtualized: Story = {
  args: {
    columns,
    data: bigRows,
    rowKey: (r: Row) => r.id,
    virtualized: true,
    height: 360,
    caption: '1,000 rows, windowed rendering — only visible rows are in the DOM',
  },
};
