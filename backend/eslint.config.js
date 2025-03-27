import typescriptEslintRecommended from '@typescript-eslint/eslint-plugin'
import prettierRecommended from 'eslint-plugin-prettier'
import nestjsRecommended from 'eslint-plugin-nestjs'
import importPlugin from 'eslint-plugin-import'

export default {
  plugins: {
    '@typescript-eslint': typescriptEslintRecommended,
    prettier: prettierRecommended,
    nestjs: nestjsRecommended,
    import: importPlugin,
  },
  rules: {
    // TypeScript-specific rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn', // Warns about usage of `any` type
    '@typescript-eslint/no-unused-vars': 'error', // Detect unused variables
    'prettier/prettier': ['error', { semi: false, singleQuote: true }], // Prettier formatting rules

    // Import rules
    'import/no-unresolved': 'error', // Ensure correct module resolution for imports
    'import/no-extraneous-dependencies': 'error', // Ensure dependencies are properly defined in package.json

    // Miscellaneous rules
    'no-console': 'warn', // Avoid using console.log in production code
    'no-debugger': 'error', // Disallow the usage of debugger
    'no-empty-function': 'warn', // Warn about empty functions
    'no-unused-vars': 'warn', // Warn about unused variables
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json', // Ensure imports work based on your TypeScript configuration
      },
    },
  },
}
