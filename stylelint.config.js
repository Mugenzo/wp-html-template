/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: ['assets/**', 'node_modules/**', '**/*.md'],
  rules: {
    // Stub / WIP partials from the Mix template
    'block-no-empty': null,

    // Keep Mix-style max-width breakpoints and @import partials
    'media-feature-range-notation': null,
    'scss/load-partial-extension': null,
    'scss/at-rule-no-unknown': null,

    // Normalize + intentional vendor prefixes / legacy clip trick
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'property-no-deprecated': null,

    // Don't fight existing colors / naming / spacing habits
    'color-hex-length': null,
    'color-function-notation': null,
    'alpha-value-notation': null,
    'declaration-empty-line-before': null,
    'rule-empty-line-before': null,
    'comment-empty-line-before': null,
    'scss/double-slash-comment-empty-line-before': null,
    'scss/double-slash-comment-whitespace-inside': null,
    'scss/operator-no-newline-after': null,
    'font-family-name-quotes': null,
    'font-family-no-duplicate-names': null,
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    'scss/dollar-variable-pattern': null,
    'scss/percent-placeholder-pattern': null,
    'scss/no-global-function-names': null,
    'no-descending-specificity': null,
    'selector-not-notation': null,
    'import-notation': null,
  },
}
