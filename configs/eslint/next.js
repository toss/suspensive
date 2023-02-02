module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['next', 'airbnb', 'airbnb-typescript', 'plugin:import/recommended', 'plugin:import/typescript', 'prettier'],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  settings: {
    next: { rootDir: ['websites/*/', 'packages/*/'] },
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/resolver': { typescript: { alwaysTryTypes: true, project: ['apps/*/tsconfig.json'] } },
  },
  rules: {
    'prettier/prettier': 'error',
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'react/jsx-props-no-spreading': ['off'],
    'react/destructuring-assignment': ['off'],
    'react/state-in-constructor': ['off'],
    'import/prefer-default-export': ['off'],
    '@typescript-eslint/no-shadow': ['off'],
    '@next/next/no-html-link-for-pages': 'off',
  },
  ignorePatterns: ['**/*.js', '**/*.json', 'node_modules', 'public', 'styles', '.next', 'coverage', 'dist', '.turbo'],
}
