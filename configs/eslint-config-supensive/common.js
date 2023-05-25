module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['plugin:import/recommended', 'airbnb-base', 'airbnb-typescript/base', 'turbo', 'prettier'],
  plugins: ['import', '@typescript-eslint', 'prettier'],
  overrides: [
    {
      files: ['*.spec.ts*', '*.test.ts*'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      rules: { 'jest/prefer-expect-assertions': 'off' },
    },
    {
      files: ['*.test-d.ts*', '*.test-d.ts*'],
      rules: { 'import/no-unresolved': ['error', { ignore: ['tsd'] }] },
    },
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-shadow': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],

    'import/prefer-default-export': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'import/extensions': ['off'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        pathGroups: [{ pattern: 'react', group: 'external', position: 'before' }],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],

    /** fix */
    // no-unused-vars
    'no-unused-vars': ['off'],
    '@typescript-eslint/no-unused-vars': ['error'],
    // no-redeclare
    'no-redeclare': ['off'],
    '@typescript-eslint/no-redeclare': ['error'],
  },
  ignorePatterns: ['node_modules', 'public', '.vscode', 'coverage', 'dist', 'esm', '.turbo', '.eslintrc.js'],
}
