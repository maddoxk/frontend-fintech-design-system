import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from '../components/Field';

describe('Field', () => {
  it('associates the label with the input', () => {
    render(<Field label="Email" placeholder="you@bank.com" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
  });

  it('exposes hint via aria-describedby', () => {
    render(<Field label="Routing number" hint="9 digits" />);
    const input = screen.getByLabelText('Routing number');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent('9 digits');
  });

  it('marks invalid and surfaces an alert when error is set', () => {
    render(<Field label="Amount" error="Must be positive" />);
    const input = screen.getByLabelText('Amount');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Must be positive');
  });

  it('accepts typed input', async () => {
    render(<Field label="Name" />);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    await userEvent.type(input, 'Ada');
    expect(input.value).toBe('Ada');
  });
});
