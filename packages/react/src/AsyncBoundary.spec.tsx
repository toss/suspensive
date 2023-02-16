import { render } from '@testing-library/react'

export const sum = (a: number, b: number) => a + b

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

describe('test', () => {
  it('should test', () => {
    const TEST_TEXT = 'suspensive'
    const fixture = render(<div>{TEST_TEXT}</div>)

    expect(fixture.getByText(TEST_TEXT)).toBeInTheDocument()
  })
})
