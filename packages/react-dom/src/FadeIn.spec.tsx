import { render, screen } from '@testing-library/react'
import { FadeIn } from './FadeIn'
import { mockAllIsIntersecting } from './test-utils'

describe('<FadeIn/>', () => {
  it('renders children with correct styles when in view', () => {
    mockAllIsIntersecting(false)
    const mockChild = vi.fn()
    render(
      <FadeIn duration={300} timingFunction="ease-in">
        {(fadeIn) => (
          <div {...fadeIn} data-testid="fade-in-child">
            {mockChild(fadeIn.style)}
          </div>
        )}
      </FadeIn>
    )
    expect(mockChild).toHaveBeenCalledWith({ opacity: 0, willChange: 'opacity', transition: 'opacity 300ms ease-in' })
    mockAllIsIntersecting(true)
    const child = screen.getByTestId('fade-in-child')
    expect(child).toHaveStyle({ opacity: '1', willChange: 'opacity', transition: 'opacity 300ms ease-in' })
    expect(mockChild).toHaveBeenCalledWith({ opacity: 1, willChange: 'opacity', transition: 'opacity 300ms ease-in' })
  })

  it('renders with default styles when duration and timingFunction are not provided', () => {
    const mockChild = vi.fn()
    render(
      <FadeIn>
        {(fadeIn) => (
          <div {...fadeIn} data-testid="fade-in-default">
            {mockChild(fadeIn.style)}
          </div>
        )}
      </FadeIn>
    )
    expect(mockChild).toHaveBeenCalledWith({
      opacity: 0,
      willChange: 'opacity',
      transition: 'opacity 200ms linear',
    })
  })
})
