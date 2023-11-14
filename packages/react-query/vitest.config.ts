import { getPackageJsonName } from '@suspensive/package-json-name'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: getPackageJsonName(),
    dir: './src',
    environment: 'jsdom',
    globals: true,
    setupFiles: './test.setup.ts',
    coverage: {
      provider: 'istanbul',
    },
  },
})
