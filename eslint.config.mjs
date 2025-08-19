// import { dirname } from 'node:path'; // Temporarily disabled due to Tailwind v4 compatibility
// import { fileURLToPath } from 'node:url'; // Temporarily disabled due to Tailwind v4 compatibility
import antfu from '@antfu/eslint-config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import playwright from 'eslint-plugin-playwright';
import storybook from 'eslint-plugin-storybook';
// import tailwind from 'eslint-plugin-tailwindcss'; // Temporarily disabled due to Tailwind v4 compatibility

export default antfu(
  {
    react: true,
    nextjs: true,
    typescript: true,

    // Configuration preferences
    lessOpinionated: true,
    isInEditor: false,

    // Code style
    stylistic: {
      semi: true,
    },

    // Format settings
    formatters: {
      css: true,
    },

    // Ignored paths
    ignores: ['migrations/**/*', '.vercel/**/*', 'vercel.json', 'MetodoScaling.md', '*.md'],
  },
  // --- Accessibility Rules ---
  jsxA11y.flatConfigs.recommended,
  // --- Tailwind CSS Rules ---
  // ...tailwind.configs['flat/recommended'], // Temporarily disabled due to Tailwind v4 compatibility
  // --- E2E Testing Rules ---
  {
    files: ['**/*.spec.ts', '**/*.e2e.ts'],
    ...playwright.configs['flat/recommended'],
  },
  // --- Storybook Rules ---
  ...storybook.configs['flat/recommended'],
  // --- Custom Rule Overrides ---
  {
    rules: {
      'antfu/no-top-level-await': 'off', // Allow top-level await
      'style/brace-style': ['error', '1tbs'], // Use the default brace style
      'ts/consistent-type-definitions': ['error', 'type'], // Use `type` instead of `interface`
      'react/prefer-destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
      'node/prefer-global/process': 'off', // Allow using `process.env`
      'test/padding-around-all': 'error', // Add padding in test files
      'test/prefer-lowercase-title': 'off', // Allow using uppercase titles in test titles
      'jsx-a11y/no-noninteractive-element-interactions': 'warn', // Convert to warning
      'jsx-a11y/no-noninteractive-tabindex': 'warn', // Convert to warning
      'jsx-a11y/no-static-element-interactions': 'warn', // Convert to warning
      '@next/next/no-img-element': 'warn', // Convert img warnings to avoid blocking build
    },
  },
);
