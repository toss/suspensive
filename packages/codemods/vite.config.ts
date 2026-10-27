import { scriptOptions } from '@suspensive/tsdown'
import { defineConfig } from 'vite-plus'
import packageJson from './package.json'

export default defineConfig({
  pack: [
    {
      ...scriptOptions,
      deps: { ...scriptOptions.deps, neverBundle: ['.bin/jscodeshift'] },
      attw: false,
    },
    {
      ...scriptOptions,
      entry: ['src/transforms/*.{ts,tsx}', '!**/*.{spec,test,test-d}.*'],
      outDir: 'dist/transforms',
      attw: false,
    },
  ],
  test: {
    name: packageJson.name,
    dir: './src',
    globals: true,
    coverage: { enabled: true, provider: 'istanbul' },
    typecheck: { enabled: true },
  },
})
