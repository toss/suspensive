module.exports = {
  ...require('@suspensive/eslint/react.js'),
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
}
