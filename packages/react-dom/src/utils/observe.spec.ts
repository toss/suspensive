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

it('should use fallback intersectionRatio when IntersectionObserver is undefined', () => {
  const element = document.createElement('div')
  const cb = vi.fn()
  const originalObserver = window.IntersectionObserver

  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: undefined,
  })

  const unmount = observe(element, cb, { threshold: 0.75 }, true)

  expect(cb).toHaveBeenCalledWith(
    true,
    expect.objectContaining({
      intersectionRatio: 0.75,
    })
  )

  unmount()

  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: originalObserver,
  })
})
