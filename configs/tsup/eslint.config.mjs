import tsconfig from '@suspensive/eslint-config-ts'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

export default [
  ...tsconfig,
  {
    ignores: ['dist'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
    },
  },
]
