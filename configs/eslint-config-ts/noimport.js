/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['jsdoc', '@typescript-eslint'],
  extends: [
    '@suspensive/eslint-config-js/noimport',
    'plugin:jsdoc/recommended-typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-empty-function': ['off'],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'jsdoc/require-description': 'warn',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/check-param-names': 'error',
  },
}
