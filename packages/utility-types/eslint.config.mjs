import path from 'path'
import { fileURLToPath } from 'url'
import { suspensiveReactTypeScriptConfig } from '@suspensive/eslint-config'

export default [
  ...suspensiveReactTypeScriptConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
        project: './tsconfig.json',
      },
    },
  },
]
