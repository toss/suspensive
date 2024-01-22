import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// we can't use process.env.NODE_ENV because of react error (in NODE_ENV: production react will use other module)
/**
 * TypeError: jsxDEV is not a function
 * - /src/contexts/SuspensiveDevModeContext.production.spec.tsx
 */
vi.stubEnv('NODE_ENV', 'production(not development)')
afterEach(() => {
  cleanup()
})
