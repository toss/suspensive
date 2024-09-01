import { render, screen } from '@testing-library/react'
import { InView } from './InView'
import { mockAllIsIntersecting } from './test-utils'

describe('<InView/>', () => {
  it('should render <InView /> intersecting', () => {
    const callback = vi.fn()
    render(<InView onChange={callback}>{({ inView, ref }) => <div ref={ref}>{inView.toString()}</div>}</InView>)

    mockAllIsIntersecting(false)
    expect(callback).toHaveBeenLastCalledWith(false, expect.objectContaining({ isIntersecting: false }))

    mockAllIsIntersecting(true)
    expect(callback).toHaveBeenLastCalledWith(true, expect.objectContaining({ isIntersecting: true }))
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should handle initialInView', () => {
    const cb = vi.fn()
    render(
      <InView initialInView onChange={cb}>
        {({ inView }) => <span>InView: {inView.toString()}</span>}
      </InView>
    )
    screen.getByText('InView: true')
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should unobserve old node', () => {
    const { rerender } = render(
      <InView>
        {({ inView, ref }) => (
          <div key="1" ref={ref}>
            Inview: {inView.toString()}
          </div>
        )}
      </InView>
    )
    rerender(
      <InView>
        {({ inView, ref }) => (
          <div key="2" ref={ref}>
            Inview: {inView.toString()}
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
