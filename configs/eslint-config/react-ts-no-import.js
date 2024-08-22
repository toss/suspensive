import noImportConfig from '@suspensive/eslint-config-ts/no-import.js'
import reactConfig from './react.js'

export default [
  ...noImportConfig,
  ...reactConfig,
  {
    rules: {
      'jsdoc/check-tag-names': ['warn', { jsxTags: true }],
      'jsdoc/require-param': 'off',
    },
  },
]
