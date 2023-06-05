/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['plugin:import/recommended', './noimport.js'],
  plugins: ['import'],
  overrides: [
    {
      files: ['*.test-d.ts*', '*.test-d.ts*'],
      rules: { 'import/no-unresolved': ['error', { ignore: ['tsd'] }] },
    },
  ],
  rules: {
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
  },
}
