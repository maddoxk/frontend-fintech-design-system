import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';
import { ThemeProvider } from '../theme/ThemeProvider';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Send money', variant: 'primary', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'default', 'success', 'warning', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    block: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancel' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Learn more' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Close account' } };
export const Loading: Story = { args: { loading: true, children: 'Processing' } };

const intents = ['primary', 'default', 'success', 'warning', 'danger', 'ghost'] as const;

const Row = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: 16 }}>
    {intents.map((v) => (
      <Button key={v} variant={v}>
        {v}
      </Button>
    ))}
    <Button variant="primary" disabled>
      disabled
    </Button>
  </div>
);

export const Variants: Story = { render: () => <Row /> };

/** Every intent in dark and light, stacked. */
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

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
