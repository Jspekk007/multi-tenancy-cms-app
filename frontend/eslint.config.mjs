import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // Vue template formatting
      'vue/max-attributes-per-line': ['error', { singleline: 1, multiline: 1 }],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
      }],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/no-v-html': 'warn',
      // Ensure valid option shape for vue/object-property-newline on ESLint 9 + plugin-vue 10
      'vue/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],

      // Array/object formatting
      'array-bracket-newline': ['error', { multiline: true, minItems: 2 }],
      'array-element-newline': ['error', { multiline: true, minItems: 2 }],
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],

      // Indentation
      '@stylistic/indent': ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoredNodes: [],
        ignoreComments: false,
      }],

      // Quotes, semi, trailing comma, etc.
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // General JS/TS
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
    },
  },

  {
    files: ['*.spec.ts', '*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
