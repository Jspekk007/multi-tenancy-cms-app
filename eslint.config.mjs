import { defineFlatConfig } from 'eslint-define-config'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'

export default defineFlatConfig([
  {
    files: ['**/*.ts', '**/*.js', '**/*.vue'],
    languageOptions: {
      parser: tsParser, // <- assign the imported parser, not a string
      parserOptions: {
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'unused-imports': unusedImportsPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/order': 'off', // in favor of simple-import-sort

      // Prettier rules inline
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      'no-inline-comments': 'off',
      'no-mixed-spaces-and-tabs': 'off',
      'no-unused-vars': 'off',
      'no-useless-constructor': 'off',
      'space-before-function-paren': 'off',
      'brace-style': 'off',
      'comma-dangle': 'off',
      'semi': 'off',
      'quotes': 'off',
    },
  },
])
