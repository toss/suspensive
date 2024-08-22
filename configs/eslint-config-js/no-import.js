import cspellPlugin from '@cspell/eslint-plugin'
import vitestPlugin from '@vitest/eslint-plugin'
import jestDomPlugin from 'eslint-plugin-jest-dom'
import jsdocPlugin from 'eslint-plugin-jsdoc'
import prettierPlugin from 'eslint-plugin-prettier'

/** @type {import('eslint').Linter.Config} */

export default [
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        es2020: true,
        browser: true,
        node: true,
        jest: true,
      },
    },
    plugins: {
      jsdoc: jsdocPlugin,
      '@cspell': cspellPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'no-warning-comments': 'warn',
      'jsdoc/require-description': 'warn',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/check-param-names': 'error',
      '@cspell/spellchecker': [
        'warn',
        {
          cspell: {
            words: ['packlint', 'codecov', 'tsup', 'nextra', 'Sandpack'],
          },
        },
      ],
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  {
    files: ['*.spec.ts*', '*.test.ts*', '*.test-d.ts*'],
    plugins: {
      '@vitest': vitestPlugin,
      'jest-dom': jestDomPlugin,
    },
    rules: {},
    settings: {
      vitest: {
        typecheck: true,
      },
    },
  },
]
