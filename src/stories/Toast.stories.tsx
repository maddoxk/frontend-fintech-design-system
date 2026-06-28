import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from '../components/Toast';
import { Button } from '../components/Button';

const meta: Meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
};
export default meta;

function Demo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button onClick={() => toast({ tone: 'success', title: 'Payment sent', message: '$250.00 to Jane Doe.' })}>Success</Button>
      <Button variant="secondary" onClick={() => toast({ tone: 'info', title: 'Statement ready', message: 'June statement is available.' })}>Info</Button>
      <Button variant="danger" onClick={() => toast({ tone: 'error', title: 'Transfer failed', message: 'Insufficient funds.' })}>Error</Button>
      <Button variant="ghost" onClick={() => toast({ tone: 'warning', title: 'Card expiring', message: 'Update your card before Aug 1.' })}>Warning</Button>
    </div>
  );
}

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};
