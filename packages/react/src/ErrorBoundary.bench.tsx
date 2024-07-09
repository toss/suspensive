import { render } from '@testing-library/react'
import { bench } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

describe('ErrorBoundary', () => {
  bench('@suspensive/react', () => {
    render(<ErrorBoundary fallback={() => <></>}></ErrorBoundary>)
  })
})
