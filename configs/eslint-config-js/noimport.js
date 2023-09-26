/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    es2020: true,
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['jsdoc'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:jsdoc/recommended'],
  rules: {
    'jsdoc/require-description': 'warn',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/check-param-names': 'error',
  },
  overrides: [
    {
      files: ['*.spec.ts*', '*.test.ts*'],
      plugins: ['vitest'],
      extends: ['plugin:vitest/recommended'],
    },
  ],
}
