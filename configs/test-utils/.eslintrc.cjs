/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@suspensive/eslint-config/react-ts'],
  ignorePatterns: ['*.js*', 'dist', 'coverage'],
}
