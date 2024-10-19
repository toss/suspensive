import { renderHook } from '@testing-library/react'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useIsClient } from './useIsClient'

const importUseIsomorphicLayoutEffect = () => {
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

  return { useIsomorphicLayoutEffect }
}
describe('useIsomorphicLayoutEffect', () => {
  const originalWindow = global.window
  afterEach(() => vi.resetModules())
  it('should be useEffect in server environment', () => {
    Object.defineProperty(global, 'window', {
      value: undefined,
    })
    const { useIsomorphicLayoutEffect } = importUseIsomorphicLayoutEffect()
    expect(useIsomorphicLayoutEffect).toEqual(useEffect)
  })

  it('should be useLayoutEffect in client environment', () => {
    Object.defineProperty(global, 'window', {
      value: originalWindow,
    })
    const { useIsomorphicLayoutEffect } = importUseIsomorphicLayoutEffect()
    expect(useIsomorphicLayoutEffect).toEqual(useLayoutEffect)
  })
})

describe('useIsClient', () => {
  it('should return true in client side rendering', () => {
    const returnedFirst = renderHook(() => useIsClient())
    expect(returnedFirst.result.current).toBe(true)
    returnedFirst.unmount()
    const returnedSecond = renderHook(() => useIsClient())
    expect(returnedSecond.result.current).toBe(true)
  })
  it("'s comparison with legacy useIsClientOnly", () => {
    // check CSR environment first
    expect(typeof document !== 'undefined').toBe(true)
    const mockUseIsClient = vi.fn(useIsClient)
    const { unmount } = renderHook(() => mockUseIsClient())
    expect(mockUseIsClient).toBeCalledTimes(1)
    unmount()
    renderHook(() => mockUseIsClient())
    expect(mockUseIsClient).toBeCalledTimes(2)
  })
  it('improve legacy useIsClientOnly', () => {
    const { useIsomorphicLayoutEffect } = importUseIsomorphicLayoutEffect()
    // check CSR environment first
    expect(typeof document !== 'undefined').toBe(true)
    let chanceIsClientToBeFalse = false
    /**
     * @deprecated This is legacy useIsClientOnly
     */
    const mockUseIsClientLegacy = vi.fn(() => {
      const [isClient, setIsClient] = useState(false)
      if (!isClient) {
        chanceIsClientToBeFalse = true
      }
      useIsomorphicLayoutEffect(() => {
        setIsClient(true)
      }, [])
      return isClient
    })
    const { unmount } = renderHook(() => mockUseIsClientLegacy())
    expect(mockUseIsClientLegacy).toBeCalledTimes(2)
    expect(chanceIsClientToBeFalse).toBe(true)
    unmount()
    renderHook(() => mockUseIsClientLegacy())
    expect(mockUseIsClientLegacy).toBeCalledTimes(4)
    expect(chanceIsClientToBeFalse).toBe(true)
  })
})
