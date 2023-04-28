const eslint = require('@suspensive/eslint/common.js')

module.exports = {
  ...eslint,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  rules: {
    ...eslint.rules,
    'react/no-unescaped-entities': ['off'],
    'react/no-array-index-key': ['warn'],
  },
}
