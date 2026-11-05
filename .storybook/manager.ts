import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

// STORYBOOK_APP_VERSION is set by the release workflow (see .github/workflows/pages.yml).
const version = process.env.STORYBOOK_APP_VERSION;

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: version ? `Fintech Design System v${version}` : 'Fintech Design System',
    brandUrl: './',
  }),
});
