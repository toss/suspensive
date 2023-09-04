import { render } from '@testing-library/react'
import { QueryErrorBoundary } from '../QueryErrorBoundary'

describe('QueryErrorBoundary', () => {
  it('should be tested', () => {
    const TEST_TEXT = 'suspensive'
    const fixture = render(
      <QueryErrorBoundary fallback={(caught) => <button onClick={caught.reset}>reset</button>}>
        {TEST_TEXT}
      </QueryErrorBoundary>
    )

    expect(fixture.getByText(TEST_TEXT)).toBeInTheDocument()
  })
})
