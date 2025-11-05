import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { options } from '@suspensive/tsdown'
import { defineConfig } from 'tsdown'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageDir = __dirname

export default defineConfig({
  ...options,
  banner: undefined,
  entry: ['src/**/*.{ts,tsx}', '!**/*.{spec,test,test-d}.*', '!**/test-utils/**/*'],
  onSuccess: `node ${join(__dirname, '..', '..', 'scripts', 'add-use-client.js')} ${packageDir}`,
})
