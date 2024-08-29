import path from 'path'
import { fileURLToPath } from 'url'
import { suspensiveTypeScriptConfig } from '@suspensive/eslint-config'

export default [
  ...suspensiveTypeScriptConfig,
  {
    ignores: ['dist'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
        project: './tsconfig.json',
      },
    },
  },
]
