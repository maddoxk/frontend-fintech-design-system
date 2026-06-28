/// <reference types="vitest" />
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// `vite-plugin-dts` pulls in @microsoft/api-extractor, which is only needed when
// emitting the library's type declarations. We lazy-load it solely for the lib
// build (BUILD_LIB=1) so that `vitest` and `storybook build` never touch that
// dependency tree.
const dtsPlugins: PluginOption[] = [];
if (process.env.BUILD_LIB === '1') {
  const dts = (await import('vite-plugin-dts')).default;
  dtsPlugins.push(
    dts({ include: ['src'], exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx', 'src/test'] }),
  );
}

export default defineConfig({
  plugins: [react(), ...dtsPlugins],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FintechDesignSystem',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
