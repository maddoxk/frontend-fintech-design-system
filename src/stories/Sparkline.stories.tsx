import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline } from '../components/Sparkline';
import { ThemeProvider } from '../theme/ThemeProvider';

const series = [12, 14, 13, 17, 16, 21, 19, 24, 23, 28, 27, 33];

const meta: Meta<typeof Sparkline> = {
  title: 'Components/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  args: { data: series, width: 240, height: 64, area: false, showLastDot: true },
};
export default meta;

type Story = StoryObj<typeof Sparkline>;

export const Line: Story = {};
export const Area: Story = { args: { area: true } };
export const Downtrend: Story = { args: { data: [40, 38, 39, 34, 30, 31, 26, 22, 18], intent: 'negative' } };
export const Flat: Story = { args: { data: [20, 20, 20, 20, 20] } };
export const Intents: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Sparkline data={series} intent="positive" />
      <Sparkline data={[40, 38, 34, 30, 26, 22]} intent="negative" />
      <Sparkline data={series} intent="warning" area />
    </div>
  ),
};

/** Line, end marker shape (circle up, square down, bar flat) and label in both themes. */
export const DarkAndLight: Story = {
  render: () => (
    <div>
      {(['dark', 'light'] as const).map((t) => (
        <ThemeProvider key={t} defaultTheme={t}>
          <div style={{ padding: 16, background: 'var(--fds-color-bg-elevated)' }}>
            <Sparkline data={series} intent="positive" width={240} height={64} />
            <Sparkline data={[40, 38, 34, 30, 26, 22]} intent="negative" width={240} height={64} />
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};
