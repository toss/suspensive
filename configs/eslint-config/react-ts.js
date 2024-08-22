import tsConfig from '@suspensive/eslint-config-ts'
import reactConfig from './react.js'
export default [
  ...tsConfig,
  ...reactConfig,
  {
    rules: {
      'jsdoc/check-tag-names': ['warn', { jsxTags: true }],
      'jsdoc/require-param': 'off',
    },
  },
]
