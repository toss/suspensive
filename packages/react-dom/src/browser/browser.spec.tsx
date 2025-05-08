import { cleanup, render, screen } from '@testing-library/react/pure'
import { type InViewOptions, useInView } from '../useInView'

afterEach(() => {
  cleanup()
})

const HookComponent = ({ options }: { options?: InViewOptions }) => {
  const div = useInView(options)

  return (
    <div ref={div.ref} data-testid="wrapper" style={{ height: 200, background: 'cyan' }} data-inview={div.isInView}>
      InView block
    </div>
  )
}

test('should come into view on after rendering', async () => {
  render(<HookComponent />)
  const wrapper = screen.getByTestId('wrapper')
  await expect.element(wrapper).toHaveAttribute('data-inview', 'true')
})

test('should come into view after scrolling', async () => {
  render(
    <>
      <div style={{ height: window.innerHeight }} />
      <HookComponent />
      <div style={{ height: window.innerHeight }} />
    </>
  )
  const wrapper = screen.getByTestId('wrapper')

  // Should not be inside the view
  expect(wrapper).toHaveAttribute('data-inview', 'false')

  // Scroll so the element comes into view
  window.scrollTo(0, window.innerHeight)
  // Should not be updated until intersection observer triggers
  expect(wrapper).toHaveAttribute('data-inview', 'false')

  await expect.element(wrapper).toHaveAttribute('data-inview', 'true')
})
