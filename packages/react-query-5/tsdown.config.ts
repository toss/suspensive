import { options } from '@suspensive/tsdown'
import { defineConfig } from 'tsdown'

export default defineConfig({ ...options, banner: { js: undefined } })
