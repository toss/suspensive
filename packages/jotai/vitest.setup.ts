import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

vi.stubEnv('NODE_ENV', 'development')
afterEach(() => {
  cleanup()
})
