import { scriptOptions } from '@suspensive/tsdown'
import { defineConfig } from 'tsdown'

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
