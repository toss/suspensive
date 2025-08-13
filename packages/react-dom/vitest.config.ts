import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    dir: './src',
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: { enabled: true, provider: 'istanbul' },
    typecheck: { enabled: true },
    projects: [
      {
        test: {
          include: ['src/**/*.{spec,test}.{ts,tsx}'],
          exclude: ['src/browser/**/*.{spec,test}.{ts,tsx}'],
          name: 'jsdom',
          environment: 'jsdom',
          globals: true,
          setupFiles: './vitest.setup.ts',
          typecheck: { enabled: true },
        },
      },
      {
        test: {
          include: ['src/browser/**/*.{spec,test}.{ts,tsx}'],
          name: 'browser',
          environment: 'node',
          globals: true,
          setupFiles: './vitest.setup.ts',
          typecheck: { enabled: true },
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
