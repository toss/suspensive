import { render } from '@testing-library/react'
import { QueryErrorBoundary } from '../QueryErrorBoundary'

describe('test', () => {
  it('should test', () => {
    const TEST_TEXT = 'suspensive'
    const fixture = render(<QueryErrorBoundary>{TEST_TEXT}</QueryErrorBoundary>)

    expect(fixture.getByText(TEST_TEXT)).toBeInTheDocument()
  })
})
