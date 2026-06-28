import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../components/Toast';

function Trigger() {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: 'Saved', message: 'Transfer queued', duration: 0 })}>
      notify
    </button>
  );
}

describe('Toast', () => {
  it('shows a toast in a live region when triggered', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('notify'));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Transfer queued')).toBeInTheDocument();
  });

  it('dismisses a toast on close', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('notify'));
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });
});
