import { render, screen } from '@testing-library/react'
import { InView } from './InView'
import { mockAllIsIntersecting } from './test-utils'

describe('<InView/>', () => {
  it('should render <InView /> intersecting', () => {
    const onChange = vi.fn()

    render(<InView onChange={onChange}>{({ isInView, ref }) => <div ref={ref}>{isInView.toString()}</div>}</InView>)

    mockAllIsIntersecting(false)
    expect(onChange).toHaveBeenLastCalledWith({
      isInView: false,
      entry: expect.objectContaining({ isIntersecting: false }),
    })
    mockAllIsIntersecting(true)
    expect(onChange).toHaveBeenLastCalledWith({
      isInView: true,
      entry: expect.objectContaining({ isIntersecting: true }),
    })
  })

  it('should handle initialIsInView', () => {
    const onChange = vi.fn()

    render(
      <InView initialIsInView onChange={onChange}>
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
    const onChange = vi.fn()

    const { unmount } = render(<InView onChange={onChange}>{() => null}</InView>)

    unmount()

    expect(onChange).not.toHaveBeenCalled()
  })
})
