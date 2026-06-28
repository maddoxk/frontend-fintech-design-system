import type { Meta, StoryObj } from '@storybook/react';
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
