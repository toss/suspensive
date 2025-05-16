import { render, screen } from '@testing-library/react'
import { useCallback, useEffect, useState } from 'react'
import { intersectionMockInstance, mockAllIsIntersecting, mockIsIntersecting } from './test-utils'
import { type InViewOptions, useInView } from './useInView'

type Mutable<TObject> = {
  -readonly [TKey in keyof TObject]: TObject[TKey]
}

const HookComponent = ({ options, unmount }: { options?: InViewOptions; unmount?: boolean }) => {
  const wrapper = useInView(options)
  return (
    <div data-testid="wrapper" ref={!unmount ? wrapper.ref : undefined}>
      {wrapper.isInView.toString()}
    </div>
  )
}

const LazyHookComponent = ({ options }: { options?: InViewOptions }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])
  const wrapper = useInView(options)
  if (isLoading) return <div>Loading</div>
  return (
    <div data-testid="wrapper" ref={wrapper.ref}>
      {wrapper.isInView.toString()}
    </div>
  )
}

describe('useInView', () => {
  it('should create a hook', () => {
    const { getByTestId } = render(<HookComponent />)
    const wrapper = getByTestId('wrapper')
    const instance = intersectionMockInstance(wrapper)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(instance.observe).toHaveBeenCalledWith(wrapper)
  })

  it('should create a hook with array threshold', () => {
    const { getByTestId } = render(<HookComponent options={{ threshold: [0.1, 1] }} />)
    const wrapper = getByTestId('wrapper')
    const instance = intersectionMockInstance(wrapper)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(instance.observe).toHaveBeenCalledWith(wrapper)
  })

  it('should create a lazy hook', () => {
    const { getByTestId } = render(<LazyHookComponent />)
    const wrapper = getByTestId('wrapper')
    const instance = intersectionMockInstance(wrapper)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(instance.observe).toHaveBeenCalledWith(wrapper)
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should create a hook inView', () => {
    const { getByText } = render(<HookComponent />)
    mockAllIsIntersecting(true)

    getByText('true')
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should mock thresholds', () => {
    render(<HookComponent options={{ threshold: [0.5, 1] }} />)
    mockAllIsIntersecting(0.2)
    screen.getByText('false')
    mockAllIsIntersecting(0.5)
    screen.getByText('true')
    mockAllIsIntersecting(1)
    screen.getByText('true')
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should create a hook with initialInView', () => {
    const { getByText } = render(<HookComponent options={{ initialIsInView: true }} />)
    getByText('true')
    mockAllIsIntersecting(false)
    getByText('false')
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should trigger a hook leaving view', () => {
    const { getByText } = render(<HookComponent />)
    mockAllIsIntersecting(true)
    mockAllIsIntersecting(false)
    getByText('false')
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should respect trigger once', () => {
    const { getByText } = render(<HookComponent options={{ triggerOnce: true }} />)
    mockAllIsIntersecting(true)
    mockAllIsIntersecting(false)

    getByText('true')
  })

  it('should trigger onChange', () => {
    const onChange = vi.fn()
    render(<HookComponent options={{ onChange }} />)

    mockAllIsIntersecting(true)
    expect(onChange).toHaveBeenLastCalledWith({
      isInView: true,
      entry: expect.objectContaining({ intersectionRatio: 1, isIntersecting: true }),
    })

    mockAllIsIntersecting(false)
    expect(onChange).toHaveBeenLastCalledWith({
      isInView: false,
      entry: expect.objectContaining({ intersectionRatio: 0, isIntersecting: false }),
    })
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should respect skip', () => {
    const { getByText, rerender } = render(<HookComponent options={{ skip: true }} />)
    mockAllIsIntersecting(false)
    getByText('false')

    rerender(<HookComponent options={{ skip: false }} />)
    mockAllIsIntersecting(true)
    getByText('true')
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should not reset current state if changing skip', () => {
    const { getByText, rerender } = render(<HookComponent options={{ skip: false }} />)
    mockAllIsIntersecting(true)
    rerender(<HookComponent options={{ skip: true }} />)
    getByText('true')
  })

  it('should unmount the hook', () => {
    const { unmount, getByTestId } = render(<HookComponent />)
    const wrapper = getByTestId('wrapper')
    const instance = intersectionMockInstance(wrapper)
    unmount()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(instance.unobserve).toHaveBeenCalledWith(wrapper)
  })

  // eslint-disable-next-line vitest/expect-expect
  it('inView should be false when component is unmounted', () => {
    const { rerender, getByText } = render(<HookComponent />)
    mockAllIsIntersecting(true)

    getByText('true')
    rerender(<HookComponent unmount />)
    getByText('false')
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should handle trackVisibility', () => {
    render(<HookComponent options={{ trackVisibility: true, delay: 100 }} />)
    mockAllIsIntersecting(true)
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should handle trackVisibility when unsupported', () => {
    render(<HookComponent options={{ trackVisibility: true, delay: 100 }} />)
  })

  const SwitchHookComponent = ({
    options,
    toggle,
    unmount,
  }: {
    options?: InViewOptions
    toggle?: boolean
    unmount?: boolean
  }) => {
    const wrapper = useInView(options)
    return (
      <>
        <div
          data-testid="item-1"
          data-inview={!toggle && wrapper.isInView}
          ref={!toggle && !unmount ? wrapper.ref : undefined}
        />
        <div
          data-testid="item-2"
          data-inview={!!toggle && wrapper.isInView}
          ref={toggle && !unmount ? wrapper.ref : undefined}
        />
      </>
    )
  }

  /**
   * This is a test for the case where people move the ref around (please don't)
   */
  it('should handle ref removed', () => {
    const { rerender, getByTestId } = render(<SwitchHookComponent />)
    mockAllIsIntersecting(true)

    const item1 = getByTestId('item-1')
    const item2 = getByTestId('item-2')

    // Item1 should be inView
    expect(item1).toHaveAttribute('data-inview', 'true')
    expect(item2).toHaveAttribute('data-inview', 'false')

    rerender(<SwitchHookComponent toggle />)
    mockAllIsIntersecting(true)

    // Item2 should be inView
    expect(item1).toHaveAttribute('data-inview', 'false')
    expect(item2).toHaveAttribute('data-inview', 'true')

    rerender(<SwitchHookComponent unmount />)

    // Nothing should be inView
    expect(item1).toHaveAttribute('data-inview', 'false')
    expect(item2).toHaveAttribute('data-inview', 'false')

    // Add the ref back
    rerender(<SwitchHookComponent />)
    mockAllIsIntersecting(true)
    expect(item1).toHaveAttribute('data-inview', 'true')
    expect(item2).toHaveAttribute('data-inview', 'false')
  })

  const MergeRefsComponent = ({ options }: { options?: InViewOptions }) => {
    const mergeInViewResult = useInView(options)
    const setRef = useCallback(
      (node: Element | null) => {
        mergeInViewResult.ref(node)
      },
      [mergeInViewResult.ref]
    )

    return <div data-testid="inview" data-inview={mergeInViewResult.isInView} ref={setRef} />
  }

  it('should handle ref merged', () => {
    const { rerender, getByTestId } = render(<MergeRefsComponent />)
    mockAllIsIntersecting(true)
    rerender(<MergeRefsComponent />)

    expect(getByTestId('inview')).toHaveAttribute('data-inview', 'true')
  })

  const MultipleHookComponent = ({ options }: { options?: InViewOptions }) => {
    const el1 = useInView(options)
    const el2 = useInView(options)
    const el3 = useInView()

    const mergedRefs = useCallback(
      (node: Element | null) => {
        el1.ref(node)
        el2.ref(node)
        el3.ref(node)
      },
      [el1.ref, el2.ref, el3.ref]
    )

    return (
      <div ref={mergedRefs}>
        <div data-testid="item-1" data-inview={el1.isInView}>
          {el1.isInView}
        </div>
        <div data-testid="item-2" data-inview={el2.isInView}>
          {el2.isInView}
        </div>
        <div data-testid="item-3" data-inview={el3.isInView}>
          {el3.isInView}
        </div>
      </div>
    )
  }

  it('should handle multiple hooks on the same element', () => {
    const { getByTestId } = render(<MultipleHookComponent options={{ threshold: 0.1 }} />)
    mockAllIsIntersecting(true)
    expect(getByTestId('item-1')).toHaveAttribute('data-inview', 'true')
    expect(getByTestId('item-2')).toHaveAttribute('data-inview', 'true')
    expect(getByTestId('item-3')).toHaveAttribute('data-inview', 'true')
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should handle thresholds missing on observer instance', () => {
    render(<HookComponent options={{ threshold: [0.1, 1] }} />)
    const wrapper = screen.getByTestId('wrapper')
    const instance = intersectionMockInstance(wrapper)
    ;(instance as unknown as Partial<Mutable<IntersectionObserver>>).thresholds = undefined
    mockAllIsIntersecting(true)

    screen.getByText('true')
  })

  // eslint-disable-next-line vitest/expect-expect
  it('should handle thresholds missing on observer instance with no threshold set', () => {
    render(<HookComponent />)
    const wrapper = screen.getByTestId('wrapper')
    const instance = intersectionMockInstance(wrapper)
    ;(instance as unknown as Partial<Mutable<IntersectionObserver>>).thresholds = undefined
    mockAllIsIntersecting(true)

    screen.getByText('true')
  })

  const HookComponentWithEntry = ({ options, unmount }: { options?: InViewOptions; unmount?: boolean }) => {
    const { ref, entry } = useInView(options)
    return (
      <div data-testid="wrapper" ref={!unmount ? ref : undefined}>
        {entry && Object.entries(entry).map(([key, value]) => `${key}: ${value}`)}
      </div>
    )
  }

  // eslint-disable-next-line vitest/expect-expect
  it('should set intersection ratio as the largest threshold smaller than trigger', () => {
    render(<HookComponentWithEntry options={{ threshold: [0, 0.25, 0.5, 0.75, 1] }} />)
    const wrapper = screen.getByTestId('wrapper')

    mockIsIntersecting(wrapper, 0.5)
    screen.getByText(/intersectionRatio: 0.5/)
  })

  it('should handle fallback if unsupported', () => {
    ;(window as unknown as { IntersectionObserver: IntersectionObserver | undefined }).IntersectionObserver = undefined
    const { rerender } = render(<HookComponent options={{ fallbackIsInView: true }} />)
    screen.getByText('true')

    rerender(<HookComponent options={{ fallbackIsInView: false }} />)
    screen.getByText('false')

    expect(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
      rerender(<HookComponent options={{ fallbackIsInView: undefined }} />)
      vi.restoreAllMocks()
    }).toThrowErrorMatchingInlineSnapshot(`[TypeError: IntersectionObserver is not a constructor]`)
  })
})
