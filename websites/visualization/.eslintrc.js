module.exports = {
  root: true,
  extends: ['@suspensive/eslint-config/next'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
}
