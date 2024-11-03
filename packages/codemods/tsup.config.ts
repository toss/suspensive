import { defineConfig } from 'tsup'

export default defineConfig([
  {
    format: 'cjs',
    target: ['node18'],
    entry: ['src/bin/*.{ts,tsx}', '!**/*.{spec,test,test-d,bench}.*'],
    outDir: 'dist/bin',
    external: ['.bin/jscodeshift'],
  },
  {
    format: 'cjs',
    target: ['node18'],
    entry: ['src/transforms/*.{ts,tsx}', '!**/*.{spec,test,test-d,bench}.*'],
    outDir: 'dist/transforms',
  },
])
