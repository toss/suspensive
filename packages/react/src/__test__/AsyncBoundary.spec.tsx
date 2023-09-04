import { render } from '@testing-library/react'
import { AsyncBoundary } from '../AsyncBoundary'
import { FALLBACK, TEXT } from './utils'

describe('AsyncBoundary', () => {
  it('should show children', () => {
    const rendered = render(<AsyncBoundary rejectedFallback={FALLBACK}>{TEXT}</AsyncBoundary>)
    expect(rendered.getByText(TEXT)).toBeInTheDocument()
  })
})

describe('AsyncBoundary.CSROnly', () => {
  it('should show children when mounted', () => {
    const rendered = render(<AsyncBoundary.CSROnly rejectedFallback={FALLBACK}>{TEXT}</AsyncBoundary.CSROnly>)
    expect(rendered.getByText(TEXT)).toBeInTheDocument()
  })
})
