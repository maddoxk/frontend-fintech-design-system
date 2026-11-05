module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'storybook-static', 'node_modules', 'coverage'],
  overrides: [
    {
      files: ['*.stories.@(ts|tsx)'],
      extends: ['plugin:storybook/recommended'],
    },
    {
      files: ['*.cjs'],
      env: { node: true },
      rules: { '@typescript-eslint/no-var-requires': 'off' },
    },
  ],
};
