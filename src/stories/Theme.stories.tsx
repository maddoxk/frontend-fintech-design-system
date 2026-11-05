import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, useTheme, type ThemeMode } from '../theme/ThemeProvider';
import { palette, spacing, radii } from '../tokens/tokens';

const meta: Meta = { title: 'Foundations/Design Tokens', tags: ['autodocs'] };
export default meta;

type Story = StoryObj;

export const Palette: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))', gap: 12 }}>
      {Object.entries(palette).map(([name, value]) => (
        <div key={name} style={{ border: '1px solid var(--fds-color-border)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: value, height: 56 }} />
          <div style={{ padding: 8, fontSize: 12 }}>
            <div style={{ fontWeight: 600 }}>{name}</div>
            <code>{value}</code>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const SpacingAndRadii: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <h3>Spacing</h3>
        {Object.entries(spacing).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <code style={{ width: 48 }}>{k}</code>
            <div style={{ height: 16, width: v, background: 'var(--fds-color-brand)' }} />
            <span style={{ fontSize: 12 }}>{v}</span>
          </div>
        ))}
      </div>
      <div>
        <h3>Radii</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          {Object.entries(radii).map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'var(--fds-color-brand)', borderRadius: v }} />
              <code style={{ fontSize: 12 }}>{k}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

function ModeSwitcher() {
  const { mode, theme, setTheme } = useTheme();
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div role="group" aria-label="Theme mode" style={{ display: 'flex', gap: 8 }}>
        {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
          <button key={m} aria-pressed={mode === m} onClick={() => setTheme(m)}>
            {m}
          </button>
        ))}
      </div>
      <span>
        Mode: {mode}, resolved: {theme}
      </span>
    </div>
  );
}

export const ThemeModes: Story = {
  render: () => (
    <ThemeProvider defaultTheme="system">
      <ModeSwitcher />
    </ThemeProvider>
  ),
};
