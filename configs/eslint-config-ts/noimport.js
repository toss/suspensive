/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['@suspensive/eslint-config-js/noimport', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-empty-function': ['off'],
    '@typescript-eslint/no-unused-vars': 'error',
  },
}
