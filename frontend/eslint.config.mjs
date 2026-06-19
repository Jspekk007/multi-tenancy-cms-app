import rootConfig from '../eslint.config.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    files: ['**/*'],
    ignores: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'build/**',
      'coverage',
      '*.config.js',
      '*.config.cjs',
      '*.config.mjs',
      'scripts',
      'tests',
      '**/*.d.ts',
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.spec.tsx',
      '**/*.test.tsx',
      '**/*.stories.tsx',
      '.storybook/**',
    ],
  },
  ...rootConfig,
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx'], // include declaration files
    languageOptions: {
      parserOptions: {
        project: null,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'no-console': 'off',
      'no-process-exit': 'error',
    },
  },
];
