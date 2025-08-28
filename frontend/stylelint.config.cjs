module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
  ],
  plugins: ['stylelint-scss'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
      rules: {
        // Allow SCSS variables/functions inside <style lang="scss">
        'declaration-property-value-no-unknown': null,
      },
    },
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
      rules: {
        // Allow SCSS variables/functions in property values
        'declaration-property-value-no-unknown': null,
      },
    },
  ],
  rules: {
    // Use SCSS-aware at-rule checker
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,

    // Keep only a few non-deprecated basics; rely on shared configs for the rest
    'no-empty-source': true,
    'no-descending-specificity': true,
  },
}
