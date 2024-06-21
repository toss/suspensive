import { options } from '@suspensive/tsup'
import { defineConfig } from 'tsup'

export default defineConfig({ ...options, entry: ['src/**/index.ts'] })
