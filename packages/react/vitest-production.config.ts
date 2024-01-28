import { defineConfig } from 'vitest/config'
import packageJson from './package.json'

export default defineConfig({
  test: {
    name: packageJson.name,
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
