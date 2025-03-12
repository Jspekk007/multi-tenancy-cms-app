module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:prettier/recommended',
      'next/core-web-vitals'
    ],
    ignorePatterns: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/coverage/**',
      '**/public/**',
      '**/*.log',
      '**/yarn.lock'
    ],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prettier/prettier': ['error', { semi: false, singleQuote: true }],
    }
  }
  