import path from 'path'
import { fileURLToPath } from 'url'
import {
  suspensiveMDXConfig,
  suspensiveNextTypeScriptConfig,
} from '@suspensive/eslint-config'

export default [
  ...suspensiveNextTypeScriptConfig,
  ...suspensiveMDXConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
        project: './tsconfig.json',
        extraFileExtensions: ['.mdx'],
      },
    },
  },
]
