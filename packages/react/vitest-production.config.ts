import { packageJsonName } from '@suspensive/package-json-name'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: packageJsonName(),
    dir: './src',
    include: ['**/*.production.*'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest-production.setup.ts',
    coverage: {
      provider: 'istanbul',
    },
  },
})
