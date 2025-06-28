import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    dir: './src',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: { enabled: true, provider: 'istanbul' },
    typecheck: { enabled: true },
  },
})
