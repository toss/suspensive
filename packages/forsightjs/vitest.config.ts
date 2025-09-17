import { defineConfig } from 'vitest/config'
import packageJson from './package.json'

export default defineConfig({
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