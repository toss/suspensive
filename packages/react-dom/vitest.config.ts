import { defineConfig } from 'vitest/config'

export default defineConfig({
  optimizeDeps: {
    include: ['@vitest/coverage-istanbul'],
  },
  test: {
    environment: 'jsdom',
    dir: './src',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'istanbul',
    },
  },
})
