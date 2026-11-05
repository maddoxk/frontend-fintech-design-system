import React from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import '../src/styles.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === 'light' ? 'light' : 'dark';
  return (
    <ThemeProvider defaultTheme={theme}>
      <div style={{ padding: 24, minHeight: '100%' }}>
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: 'todo' },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Components'],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Light / dark theme',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
