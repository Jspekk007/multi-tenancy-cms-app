module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:unused-imports/recommended',  // Correct way to extend the plugin
  ],
  rules: {
    "unused-imports/no-unused-imports": "error",
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off', // Disable to avoid conflict with unused-imports
    'prettier/prettier': ['error', { semi: false, singleQuote: true }],
  },
}
