import { options } from '@suspensive/tsdown'
import { defineConfig } from 'tsdown'

export default defineConfig({
  ...options,
  banner: undefined,
  entry: ['src/**/*.{ts,tsx}', '!**/*.{spec,test,test-d}.*', '!**/test-utils/**/*'],
})
