/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['plugin:import/typescript', './no-import.js'],
  plugins: ['import'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  overrides: [
    {
      files: ['*.test-d.ts*', '*.test-d.ts*'],
      rules: { 'import/no-unresolved': ['error', { ignore: ['tsd'] }] },
    },
  ],
  rules: {
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'import/no-duplicates': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'never',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
}
