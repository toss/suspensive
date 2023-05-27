module.exports = {
  root: true,
  extends: ['@suspensive/eslint-config/react'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
}
