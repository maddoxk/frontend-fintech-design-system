import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Widget } from '../components/Widget';
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

const Placeholders = () => (
  <div style={{ display: 'grid', gap: 12, padding: 16, width: 320 }}>
    <Select label="Currency" placeholder="Select a currency" options={currencies} />
    <Select label="Required" required placeholder="Select a currency" options={currencies} />
  </div>
);

export const Placeholder: Story = {
  args: { placeholder: 'Select a currency' },
  render: () => (
    <div style={{ display: 'flex' }}>
      <ThemeProvider defaultTheme="dark">
        <Placeholders />
      </ThemeProvider>
      <ThemeProvider defaultTheme="light">
        <Placeholders />
      </ThemeProvider>
    </div>
  ),
};

const Groups = () => (
  <div style={{ padding: 16, width: 320 }}>
    <Select label="Account" placeholder="Select an account">
      <optgroup label="Cash">
        <option value="chk">Checking</option>
        <option value="sav">Savings</option>
      </optgroup>
      <optgroup label="Investments">
        <option value="brk">Brokerage</option>
        <option value="ira" disabled>
          IRA (unavailable)
        </option>
      </optgroup>
    </Select>
  </div>
);

export const OptionGroups: Story = {
  render: () => (
    <div style={{ display: 'flex' }}>
      <ThemeProvider defaultTheme="dark">
        <Groups />
      </ThemeProvider>
      <ThemeProvider defaultTheme="light">
        <Groups />
      </ThemeProvider>
    </div>
  ),
};

const InWidget = () => (
  <div style={{ padding: 16, width: 360 }}>
    <Widget title="Transfer">
      <Select label="Currency" hint="Used for statements." placeholder="Select a currency" options={currencies} />
    </Widget>
  </div>
);

export const InsideAWidget: Story = {
  name: 'Inside a Widget',
  render: () => (
    <div style={{ display: 'flex' }}>
      <ThemeProvider defaultTheme="dark">
        <InWidget />
      </ThemeProvider>
      <ThemeProvider defaultTheme="light">
        <InWidget />
      </ThemeProvider>
    </div>
  ),
};
