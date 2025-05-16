import { intersectionMockInstance, mockIsIntersecting } from '../test-utils'
import { observe, optionsToId } from './observe'

it('should be able to use observe', () => {
  const element = document.createElement('div')
  const cb = vi.fn()
  const unmount = observe(element, cb, { threshold: 0.1 })

  mockIsIntersecting(element, true)
  expect(cb).toHaveBeenCalled()

  // should be unmounted after unmount
  unmount()
  expect(() => intersectionMockInstance(element)).toThrowErrorMatchingInlineSnapshot(
    `[Error: Failed to find IntersectionObserver for element. Is it being observed?]`
  )
})

it('should be able to use observe without options', () => {
  const element = document.createElement('div')
  const cb = vi.fn()
  const unmount = observe(element, cb)

  mockIsIntersecting(element, true)
  expect(cb).toHaveBeenCalled()

  // should be unmounted after unmount
  unmount()
  expect(() => intersectionMockInstance(element)).toThrowErrorMatchingInlineSnapshot(
    `[Error: Failed to find IntersectionObserver for element. Is it being observed?]`
  )
})

it('should convert options to id', () => {
  expect(
    optionsToId({
      root: document.createElement('div'),
      rootMargin: '10px 10px',
      threshold: [0, 1],
    })
  ).toMatchInlineSnapshot(`"root_1,rootMargin_10px 10px,threshold_0,1"`)
  expect(
    optionsToId({
      root: null,
      rootMargin: '10px 10px',
      threshold: 1,
    })
  ).toMatchInlineSnapshot(`"root_0,rootMargin_10px 10px,threshold_1"`)
  expect(
    optionsToId({
      threshold: 0,
      trackVisibility: true,
      delay: 500,
    })
  ).toMatchInlineSnapshot(`"delay_500,threshold_0,trackVisibility_true"`)
  expect(
    optionsToId({
      threshold: 0,
    })
  ).toMatchInlineSnapshot(`"threshold_0"`)
  expect(
    optionsToId({
      threshold: [0, 0.5, 1],
    })
  ).toMatchInlineSnapshot(`"threshold_0,0.5,1"`)
})

it('should fallback to [threshold] when observer.thresholds is undefined and threshold is a number', () => {
  const element = document.createElement('div')
  const cb = vi.fn()
  const mockObserve = vi.fn()
  const mockUnobserve = vi.fn()
  const mockDisconnect = vi.fn()

  let recordedThresholds: number[] | undefined

  class FakeObserver {
    thresholds?: undefined
    constructor(_: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      recordedThresholds = Array.isArray(options?.threshold) ? options.threshold : [options?.threshold ?? 0]
    }
    observe = mockObserve
    unobserve = mockUnobserve
    disconnect = mockDisconnect
  }

  const originalObserver = globalThis.IntersectionObserver
  globalThis.IntersectionObserver = FakeObserver as unknown as typeof IntersectionObserver

  const unobserve = observe(element, cb, { threshold: 0.7 })

  expect(recordedThresholds).toEqual([0.7])
  expect(mockObserve).toHaveBeenCalledWith(element)

  unobserve()
  globalThis.IntersectionObserver = originalObserver
})

it('should fallback to [threshold] when observer.thresholds is undefined and threshold is an array', () => {
  const element = document.createElement('div')
  const cb = vi.fn()
  const mockObserve = vi.fn()
  const mockUnobserve = vi.fn()
  const mockDisconnect = vi.fn()

  let recordedThresholds: number[] | undefined

  class FakeObserver {
    thresholds?: undefined
    constructor(_: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      recordedThresholds = Array.isArray(options?.threshold) ? options.threshold : [options?.threshold ?? 0]
    }
    observe = mockObserve
    unobserve = mockUnobserve
    disconnect = mockDisconnect
  }

  const originalObserver = globalThis.IntersectionObserver
  globalThis.IntersectionObserver = FakeObserver as unknown as typeof IntersectionObserver

  const unobserve = observe(element, cb, { threshold: [0.1, 0.5, 0.9] })

  expect(recordedThresholds).toEqual([0.1, 0.5, 0.9])
  expect(mockObserve).toHaveBeenCalledWith(element)

  unobserve()
  globalThis.IntersectionObserver = originalObserver
})

it('should fallback to [0] when observer.thresholds is undefined and threshold is not set', () => {
  const element = document.createElement('div')
  const cb = vi.fn()
  const mockObserve = vi.fn()
  const mockUnobserve = vi.fn()
  const mockDisconnect = vi.fn()

  let recordedThresholds: number[] | undefined

  class FakeObserver {
    thresholds?: undefined
    constructor(_: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      recordedThresholds = Array.isArray(options?.threshold) ? options.threshold : [options?.threshold ?? 0]
    }
    observe = mockObserve
    unobserve = mockUnobserve
    disconnect = mockDisconnect
  }

  const originalObserver = globalThis.IntersectionObserver
  globalThis.IntersectionObserver = FakeObserver as unknown as typeof IntersectionObserver

  const unobserve = observe(element, cb)

  expect(recordedThresholds).toEqual([0])
  expect(mockObserve).toHaveBeenCalledWith(element)

  unobserve()
  globalThis.IntersectionObserver = originalObserver
})
