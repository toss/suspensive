import codspeedPlugin from '@codspeed/vitest-plugin'
import { defineConfig } from 'vitest/config'
import packageJson from './package.json'

export default defineConfig({
  plugins: process.env.CI === 'true' ? [codspeedPlugin()] : [],
  test: {
    name: packageJson.name,
    dir: './src',
    exclude: ['**/*.production.*'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    benchmark: { outputJson: `benchmarks/${packageJson.version}.json` },
    coverage: {
      provider: 'istanbul',
    },
  },
})
