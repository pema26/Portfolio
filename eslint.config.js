// ESLint checks the code for common mistakes. Run it with:  npm run lint
// This is the standard configuration from Vite's React template.
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
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
    // Content files deliberately export TWO things: a `meta` object (named
    // export) and the write-up component (default export). The React Refresh
    // rule prefers one-component-per-file, so it is switched off just here.
    files: ['src/content/**/*.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
]);
