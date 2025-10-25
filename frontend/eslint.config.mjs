import rootConfig from '../eslint.config.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  ...rootConfig,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
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
    ],
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
