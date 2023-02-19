import { render } from '@testing-library/react'

describe('test', () => {
  it('should test', () => {
    const TEST_TEXT = 'suspensive'
    const fixture = render(<div>{TEST_TEXT}</div>)

    expect(fixture.getByText(TEST_TEXT)).toBeInTheDocument()
  })
})
