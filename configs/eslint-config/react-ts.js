/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['./react.js', '@suspensive/eslint-config-ts'],
  rules: {
    'jsdoc/check-tag-names': ['warn', { jsxTags: true }],
    'jsdoc/require-param': ['off'],
  },
}
