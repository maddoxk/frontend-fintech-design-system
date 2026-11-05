import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../theme/ThemeProvider';
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

const Row = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: 16 }}>
    <StatusBadge tone="positive">Settled</StatusBadge>
    <StatusBadge tone="warning">Pending</StatusBadge>
    <StatusBadge tone="negative">Declined</StatusBadge>
    <StatusBadge tone="info">In review</StatusBadge>
    <StatusBadge tone="neutral">Archived</StatusBadge>
  </div>
);

/** Intent-tinted tags in dark and light; every tag carries a text label. */
export const BothThemes: Story = {
  render: () => (
    <div>
      <ThemeProvider defaultTheme="dark">
        <Row />
      </ThemeProvider>
      <ThemeProvider defaultTheme="light">
        <Row />
      </ThemeProvider>
    </div>
  ),
};
