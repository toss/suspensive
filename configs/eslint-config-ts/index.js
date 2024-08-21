import parser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import noImportConfig from './no-import.js'

/** @type {import('eslint').Linter.Config} */
export default [
  {
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parser: parser,
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'import/no-cycle': 'error',
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      'import/no-unresolved': 'off',
      'import/order': [
        'error',
        {
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  ...noImportConfig,
]
