import { options, scriptOptions } from '@suspensive/tsdown'
import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    ...options,
    banner: { js: undefined },
  },
  scriptOptions,
])
