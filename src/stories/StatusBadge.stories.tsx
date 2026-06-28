import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from '../components/StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  args: { children: 'Active', tone: 'positive', dot: true },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'positive', 'negative', 'warning', 'info'] },
  },
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {};
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <StatusBadge tone="positive">Settled</StatusBadge>
      <StatusBadge tone="warning">Pending</StatusBadge>
      <StatusBadge tone="negative">Declined</StatusBadge>
      <StatusBadge tone="info">In review</StatusBadge>
      <StatusBadge tone="neutral">Archived</StatusBadge>
    </div>
  ),
};
