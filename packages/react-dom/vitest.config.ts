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
        extends: 'vitest.config.ts',
        test: {
          include: ['**/*.{spec,test}.{ts,tsx}'],
          exclude: ['browser/*.{spec,test}.{ts,tsx}'],
          name: 'jsdom',
          environment: 'jsdom',
        },
      },
      {
        extends: 'vitest.config.ts',
        test: {
          include: ['browser/*.{spec,test}.{ts,tsx}'],
          name: 'browser',
          environment: 'node',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            name: 'chromium',
          },
        },
      },
    ],
  },
})
