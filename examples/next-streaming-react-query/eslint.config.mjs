import path from 'path'
import { fileURLToPath } from 'url'
import { suspensiveNextTypeScriptConfig } from '@suspensive/eslint-config'

export default [
  ...suspensiveNextTypeScriptConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
        project: './tsconfig.json',
      },
    },
  },
]
