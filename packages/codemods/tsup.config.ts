import { scriptOptions } from '@suspensive/tsup'
import { defineConfig } from 'tsup'

export default defineConfig([
  {
    ...scriptOptions,
    external: ['.bin/jscodeshift'],
  },
  {
    ...scriptOptions,
    entry: ['src/transforms/*.{ts,tsx}', '!**/*.{spec,test,test-d}.*'],
    outDir: 'dist/transforms',
  },
])
