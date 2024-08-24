import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: 'vitest.config.ts',
    test: {
      include: ['src/**/*.{spec,test}.{ts,tsx}'],
      exclude: ['**/browser.{spec,test}.{ts,tsx}'],
      name: 'jsdom',
      environment: 'jsdom',
    },
  },
  {
    extends: 'vitest.config.ts',
    test: {
      include: ['src/**/browser.{spec,test}.{ts,tsx}'],
      name: 'browser',
      environment: 'node',
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
        headless: true,
      },
    },
  },
])
