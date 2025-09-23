import rootConfig from '../eslint.config.mjs'

export default [
  ...rootConfig,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
        project: './tsconfig.json', // backend-express/tsconfig.json
      },
    },
    rules: {
      'no-console': 'off',
      'no-process-exit': 'error',
    },
  },
]
