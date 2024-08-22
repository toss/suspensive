import jsConfig from '@suspensive/eslint-config-js'
import reactConfig from './react.js'

export default [
  ...jsConfig,
  ...reactConfig,
  {
    rules: {
      'jsdoc/check-tag-names': ['warn', { jsxTags: true }],
      'jsdoc/require-param': 'off',
    },
  },
]
