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

  it('should handle initialIsInView', () => {
    const callback = vi.fn()

    render(
      <InView initialIsInView onChange={callback}>
        {({ isInView }) => <span>InView: {isInView.toString()}</span>}
      </InView>
    )

    expect(screen.getByText('InView: true')).toBeInTheDocument()
  })

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

    expect(screen.getByText('Inview: false')).toBeInTheDocument()

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
    expect(screen.getByText('Inview: true')).toBeInTheDocument()
  })

  it('should ensure node exists before observing and unobserving', () => {
    const callback = vi.fn()

    const { unmount } = render(<InView onChange={callback}>{() => null}</InView>)

    unmount()

    expect(callback).not.toHaveBeenCalled()
  })
})
