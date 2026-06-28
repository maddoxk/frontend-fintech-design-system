import type { StorybookConfig } from '@storybook/react-vite';

const BASE = process.env.STORYBOOK_BASE_PATH || '/';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: { disableTelemetry: true },
  docs: {},
  async viteFinal(config) {
    config.base = BASE;
    return config;
  },
};

export default config;
