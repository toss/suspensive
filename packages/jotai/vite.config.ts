import { options } from '@suspensive/tsdown'
import { defineConfig } from 'vite-plus'
import packageJson from './package.json'

export default defineConfig({
  pack: options,
  test: {
    name: packageJson.name,
    dir: './src',
    exclude: ['**/*.production.*'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: { enabled: true, provider: 'istanbul' },
    typecheck: { enabled: true },
  },
})
