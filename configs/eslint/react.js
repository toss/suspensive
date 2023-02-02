module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['airbnb', 'airbnb-typescript', 'plugin:import/recommended', 'plugin:import/typescript', 'prettier'],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  settings: {
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': { typescript: { alwaysTryTypes: true, project: ['packages/*/tsconfig.json'] } },
  },
  rules: {
    'prettier/prettier': 'error',
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'react/jsx-props-no-spreading': ['off'],
    'react/destructuring-assignment': ['off'],
    'react/state-in-constructor': ['off'],
    'react/require-default-props': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'react/jsx-no-useless-fragment': ['off'],
    'import/prefer-default-export': ['off'],
    '@typescript-eslint/no-shadow': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],
    'react/display-name': ['error'],
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
  },
  ignorePatterns: ['**/*.js', '**/*.json', 'node_modules', 'public', 'styles', '.next', 'coverage', 'dist', '.turbo'],
}
