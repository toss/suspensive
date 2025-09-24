import pluginReact from '@eslint-react/eslint-plugin'
import { defineConfig } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import next from '@next/eslint-plugin-next'
import cspellConfigs from '@cspell/eslint-plugin/configs'
import vitest from '@vitest/eslint-plugin'
import jestDom from 'eslint-plugin-jest-dom'
import * as mdx from 'eslint-plugin-mdx'

const ignores = ['**/.next/**', '**/build/**', '**/coverage/**', '**/dist/**']

export const suspensiveTypeScriptConfig = defineConfig(
  {
    ignores,
  },
  cspellConfigs.recommended,
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx,js,jsx,cjs,mjs}'],
    ignores: ['**/*.mdx/**/*.{ts,tsx,js,jsx,cjs,mjs}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.mdx/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        parser: tseslint.parser,
      },
    },
    plugins: {
      jsdoc: jsdoc,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@cspell/spellchecker': [
        'warn',
        {
          cspell: {
            words: ['packlint', 'codecov', 'tsdown', 'nextra', 'Sandpack', 'codemod', 'codemods', 'jscodeshift'],
          },
        },
      ],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
          custom: {
            regex: '^(T|T[A-Z][A-Za-z]+)$',
            match: true,
          },
        },
      ],
      'jsdoc/require-description': 'warn',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/check-param-names': 'error',
      'jsdoc/no-types': 'off',

      // @typescript-eslint/strict
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/only-throw-error': 'warn',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-extra-semi': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/ban-ts-comment': ['error', { minimumDescriptionLength: 3 }],
      '@typescript-eslint/triple-slash-reference': 'warn',
    },
  },
  {
    files: ['**/*.spec.ts*', '**/*.test.ts*', '**/*.test-d.ts*'],
    plugins: { vitest },
    rules: vitest.configs.recommended.rules,
    settings: { vitest: { typecheck: true } },
  },
  jestDom.configs['flat/recommended'],
  {
    plugins: {
      import: importPlugin,
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
  eslintPluginPrettierRecommended
)

export const suspensiveReactTypeScriptConfig = defineConfig(
  ...suspensiveTypeScriptConfig,
  reactHooks.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...pluginReact.configs.recommended,
    ignores: ['**/*.mdx/**/*.{ts,tsx}'],
  },
  {
    languageOptions: {
      globals: {
        JSX: true,
      },
    },
    rules: {
      'react-hooks/react-compiler': 'warn',
      '@eslint-react/no-use-context': 'off',
      '@eslint-react/no-forward-ref': 'off',
      '@eslint-react/no-context-provider': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
)

export const suspensiveNextTypeScriptConfig = [
  ...suspensiveReactTypeScriptConfig,
  { plugins: { 'plugin:@next/next/recommended': next.configs.recommended } },
]

export const suspensiveMDXConfig = [
  mdx.configs.flat,
  mdx.configs.flatCodeBlocks,
  {
    files: ['**/*.mdx'],
    ...mdx.flat,
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
      languageMapper: {},
    }),
  },
  {
    files: ['**/*.mdx'],
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
]
