/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['plugin:import/recommended', './noimport.js'],
  plugins: ['import'],
  rules: {
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'import/no-duplicates': ['warn'],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
}
