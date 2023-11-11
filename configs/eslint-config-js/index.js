/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['plugin:import/recommended', './no-import.js'],
  plugins: ['import'],
  rules: {
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'import/no-duplicates': 'error',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
}
