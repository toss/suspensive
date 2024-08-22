import importPlugin from 'eslint-plugin-import'
import noImportConfig from './no-import.js'

/** @type {import('eslint').Linter.Config} */

export default [
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'import/no-cycle': 'error',
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  ...noImportConfig,
]
