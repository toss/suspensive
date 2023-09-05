import { forPackage } from '@suspensive/vitest'
import { defineConfig } from 'vitest/config'

export default defineConfig(
  forPackage({
    test: {
      name: 'suspensive renamed test name',
    },
  })
)
