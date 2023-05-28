module.exports = {
  root: true,
  extends: ['@suspensive/eslint-config/common'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
}
