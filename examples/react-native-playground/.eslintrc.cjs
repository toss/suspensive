/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@suspensive/eslint-config/react-ts', '@react-native-community'],
  ignorePatterns: ['dist', 'coverage'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
}
