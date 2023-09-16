import { render } from '@testing-library/react'
import { ERROR_MESSAGE, FALLBACK, TEXT } from './utils/toTest'
import { AsyncBoundary, withAsyncBoundary } from '.'

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

const TestWithAsyncBoundary = withAsyncBoundary(() => <>{TEXT}</>, { rejectedFallback: ERROR_MESSAGE })
describe('withAsyncBoundary', () => {
  it('should show children', () => {
    const rendered = render(<TestWithAsyncBoundary />)
    expect(rendered.queryByText(TEXT)).toBeInTheDocument()
  })
})
const TestWithAsyncBoundaryCSROnly = withAsyncBoundary.CSROnly(() => <>{TEXT}</>, { rejectedFallback: ERROR_MESSAGE })
describe('withAsyncBoundary.CSROnly', () => {
  it('should show children when mounted', () => {
    const rendered = render(<TestWithAsyncBoundaryCSROnly />)
    expect(rendered.queryByText(TEXT)).toBeInTheDocument()
  })
})
