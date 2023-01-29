module.exports = {
  ...require('@suspensive/config/eslint-react.js'),
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
}
