import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline } from '../components/Sparkline';

const series = [12, 14, 13, 17, 16, 21, 19, 24, 23, 28, 27, 33];

const meta: Meta<typeof Sparkline> = {
  title: 'Components/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  args: { data: series, width: 240, height: 64, area: true, showLastDot: true },
};
export default meta;

type Story = StoryObj<typeof Sparkline>;

export const Area: Story = {};
export const LineOnly: Story = { args: { area: false } };
export const Downtrend: Story = { args: { data: [40, 38, 39, 34, 30, 31, 26, 22, 18] } };
