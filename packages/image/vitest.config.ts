import packageJsonName from '@suspensive/package-json-name'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: packageJsonName(),
    dir: './src',
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'istanbul',
    },
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      name: 'chromium',
    },
  },
})
