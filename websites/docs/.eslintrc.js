/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@suspensive/eslint-config/react-ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  rules: {
    // @theme, @docusaurus, etc aren't actual paths. They are webpack aliases. To prevent ESLint from tripping up on those, you could ignore those in the ESLint settings
    'import/no-unresolved': [2, { ignore: ['^@theme', '^@docusaurus', '^@site'] }],
  },
}
