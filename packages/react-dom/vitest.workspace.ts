import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: 'vitest.config.ts',
    test: {
      include: ['**/*.{spec,test}.{ts,tsx}'],
      exclude: ['**/*.browser.{spec,test}.{ts,tsx}', '**/browser/*.{spec,test}.{ts,tsx}'],
      name: 'jsdom',
      environment: 'jsdom',
    },
  },
  {
    extends: 'vitest.config.ts',
    test: {
      include: ['**/browser/*.{spec,test}.{ts,tsx}'],
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
