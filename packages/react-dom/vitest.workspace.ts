import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
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
