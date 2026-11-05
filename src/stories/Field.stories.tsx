import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Field } from '../components/Field';

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
  args: { label: 'Email address', placeholder: 'you@example.com' },
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {};
export const WithHint: Story = {
  args: { label: 'Routing number', hint: '9 digits, found on your check.' },
};
export const Required: Story = { args: { label: 'Legal name', required: true } };
export const WithError: Story = {
  args: { label: 'Account number', defaultValue: '12', error: 'Account number must be 8 digits.' },
};

export const Disabled: Story = { args: { label: 'Account number', defaultValue: '12345678', disabled: true } };

const States = () => (
  <div style={{ display: 'grid', gap: 12, padding: 16, width: 320 }}>
    <Field label="Default" placeholder="you@example.com" />
    <Field label="With error" defaultValue="12" error="Account number must be 8 digits." />
    <Field label="Disabled" defaultValue="12345678" disabled />
  </div>
);

/** Default, error and disabled states in dark and light. */
export const BothThemes: Story = {
  render: () => (
    <div style={{ display: 'flex' }}>
      <ThemeProvider defaultTheme="dark">
        <States />
      </ThemeProvider>
      <ThemeProvider defaultTheme="light">
        <States />
      </ThemeProvider>
    </div>
  ),
};
