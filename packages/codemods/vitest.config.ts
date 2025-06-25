import { defineConfig } from 'vitest/config'
import packageJson from './package.json'

export default defineConfig({
  test: {
    name: packageJson.name,
    dir: './src',
    globals: true,
    coverage: { enabled: true, provider: 'istanbul' },
    typecheck: { enabled: true },
  },
})
