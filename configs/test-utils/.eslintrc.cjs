/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@suspensive/eslint-config/react-ts'],
  ignorePatterns: ['dist'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
}
