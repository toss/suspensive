import { render, screen } from '@testing-library/react'
import { mockAllIsIntersecting } from './test-utils'
import { useFadeIn } from './useFadeIn'

const HookComponent = () => {
  const fadeIn = useFadeIn({})
  return <div data-testid="wrapper" {...fadeIn} />
}

describe('useFadeIn', () => {
  it('applies initial hidden styles and transitions to visible when intersecting', () => {
    render(<HookComponent />)
    const element = screen.getByTestId('wrapper')
    expect(element).toHaveStyle({
      opacity: '0',
      willChange: 'opacity',
      transition: 'opacity 200ms linear',
    })
    mockAllIsIntersecting(true)
    expect(element).toHaveStyle({
      opacity: '1',
      transition: 'opacity 200ms linear',
    })
  })
})
