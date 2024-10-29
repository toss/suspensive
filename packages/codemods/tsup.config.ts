import { defineConfig } from 'tsup'

export default defineConfig({
  format: 'cjs',
  target: ['node18'],
  entry: ['src/**/*.{ts,tsx}', '!**/*.{spec,test,test-d,bench}.*'],
  outDir: 'dist',
  external: ['.bin/jscodeshift'],
})
