import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Select } from '../components/Select';

const currencies = [
  { value: 'usd', label: 'US Dollar (USD)' },
  { value: 'eur', label: 'Euro (EUR)' },
  { value: 'gbp', label: 'Pound Sterling (GBP)' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Currency', options: currencies },
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'Used for statements and exports.' } };
export const WithError: Story = { args: { error: 'Choose a currency to continue.' } };
export const Disabled: Story = { args: { disabled: true } };

const States = () => (
  <div style={{ display: 'grid', gap: 12, padding: 16, width: 320 }}>
    <Select label="Default" options={currencies} />
    <Select label="With hint" hint="Used for statements." options={currencies} />
    <Select label="With error" error="Choose a currency to continue." options={currencies} />
    <Select label="Disabled" disabled options={currencies} />
  </div>
);

/** Default, hint, error and disabled states in dark and light. */
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
