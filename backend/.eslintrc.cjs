module.exports = {
    root: true,
    extends: ['../../.eslintrc.cjs'],
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: __dirname,
    },
    env: {
      node: true,
      es2021: true,
    },
    rules: {
      // TypeScript strictness
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
  
      // Node.js best practices
      'no-console': 'off', // allow console.log for backend debugging
      'prefer-const': 'error',
      'no-var': 'error',
      'no-process-exit': 'error', // avoid process.exit in production code
  
      // Imports
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.ts',
            '**/*.spec.ts',
            'vite.config.ts',
            '**/scripts/**',
          ],
        },
      ],
      'import/extensions': ['error', 'ignorePackages', { ts: 'never' }],
  
      // Backend-specific stylistic rules
      'no-underscore-dangle': 'off', // often used in _trpc / _app
      'object-curly-spacing': ['error', 'always'],
      'semi': ['error', 'always'],
    },
  };
  