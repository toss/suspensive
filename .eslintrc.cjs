/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@suspensive/eslint-config-ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
}
