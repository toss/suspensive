import { suspensiveTypeScriptConfig } from '@suspensive/eslint-config'

export default [
  ...suspensiveTypeScriptConfig,
  {
    ignores: ['./src/transforms/testfixtures/**'],
  },
]
