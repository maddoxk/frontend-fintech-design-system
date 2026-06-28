import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, type Column } from '../components/DataTable';

interface Row {
  id: string;
  name: string;
  amount: number;
}

const data: Row[] = [
  { id: '1', name: 'Charlie', amount: 30 },
  { id: '2', name: 'Alice', amount: 10 },
  { id: '3', name: 'Bob', amount: 20 },
];

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name' },
  { key: 'amount', header: 'Amount', numeric: true },
];

function getBodyRows(): HTMLElement[] {
  const table = screen.getByRole('table');
  const body = table.querySelectorAll<HTMLElement>('tbody tr');
  return Array.from(body);
}

describe('DataTable', () => {
  it('renders all rows', () => {
    render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} />);
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('sorts ascending then descending on header click', async () => {
    render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} />);
    const amountHeader = screen.getByText('Amount').closest('th')!;

    await userEvent.click(amountHeader);
    expect(amountHeader).toHaveAttribute('aria-sort', 'ascending');
    let cells = getBodyRows().map((r) => within(r).getAllByRole('cell')[1].textContent);
    expect(cells).toEqual(['10', '20', '30']);

    await userEvent.click(amountHeader);
    expect(amountHeader).toHaveAttribute('aria-sort', 'descending');
    cells = getBodyRows().map((r) => within(r).getAllByRole('cell')[1].textContent);
    expect(cells).toEqual(['30', '20', '10']);
  });

  it('sorts via keyboard (Enter)', async () => {
    render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} />);
    const nameHeader = screen.getByText('Name').closest('th')!;
    nameHeader.focus();
    await userEvent.keyboard('{Enter}');
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    const cells = getBodyRows().map((r) => within(r).getAllByRole('cell')[0].textContent);
    expect(cells).toEqual(['Alice', 'Bob', 'Charlie']);
  });
});
