import { render, screen } from '@testing-library/react'
import { InView } from './InView'
import { mockAllIsIntersecting } from './test-utils'

describe('<InView/>', () => {
  it('should render <InView /> intersecting', () => {
    const callback = vi.fn()
    render(<InView onChange={callback}>{({ isInView, ref }) => <div ref={ref}>{isInView.toString()}</div>}</InView>)

    mockAllIsIntersecting(false)
    expect(callback).toHaveBeenLastCalledWith({
      isInView: false,
      entry: expect.objectContaining({ isIntersecting: false }),
    })

    mockAllIsIntersecting(true)
    expect(callback).toHaveBeenLastCalledWith({
      isInView: true,
      entry: expect.objectContaining({ isIntersecting: true }),
    })
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should handle initialIsInView', () => {
    const cb = vi.fn()
    render(
      <InView initialIsInView onChange={cb}>
        {({ isInView }) => <span>InView: {isInView.toString()}</span>}
      </InView>
    )
    screen.getByText('InView: true')
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should unobserve old node', () => {
    const { rerender } = render(
      <InView>
        {({ isInView, ref }) => (
          <div key="1" ref={ref}>
            Inview: {isInView.toString()}
          </div>
        )}
      </InView>
    )
    rerender(
      <InView>
        {({ isInView, ref }) => (
          <div key="2" ref={ref}>
            Inview: {isInView.toString()}
          </div>
        )}
      </InView>
    )
    mockAllIsIntersecting(true)
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should ensure node exists before observing and unobserving', () => {
    const { unmount } = render(<InView>{() => null}</InView>)
    unmount()
  })
})
