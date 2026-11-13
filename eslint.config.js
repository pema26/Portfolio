// ESLint checks the code for common mistakes. Run it with:  npm run lint
// Keep shared JavaScript checks separate from React-only checks.
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist/**', '**/.venv/**', 'test-results/**', 'playwright-report/**']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
  },
  {
    // Content files deliberately export TWO things: a `meta` object (named
    // export) and the write-up component (default export). The React Refresh
    // rule prefers one-component-per-file, so it is switched off just here.
    files: ['src/content/**/*.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
]);
