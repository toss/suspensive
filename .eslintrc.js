module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaFeatures: { jsx: true },
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.eslint.json',
      './docs/*/tsconfig.json',
      './packages/*/tsconfig.json',
    ],
    
  },

  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
    'shared-node-browser': true,
  },

  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'next',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'next/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@chakra-ui/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@emotion/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '~/**',
            group: 'parent',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'next', 'next/**', '@emotion/**'],
        'newlines-between': 'never',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
