/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@suspensive/eslint-config-ts'],
  ignorePatterns: ['*.js*', 'dist', 'coverage'],
}
