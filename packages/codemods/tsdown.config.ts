import { scriptOptions } from '@suspensive/tsdown'
import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    ...scriptOptions,
    external: ['.bin/jscodeshift'],
    attw: false,
  },
  {
    ...scriptOptions,
    entry: ['src/transforms/*.{ts,tsx}', '!**/*.{spec,test,test-d}.*'],
    outDir: 'dist/transforms',
    attw: false,
  },
])
