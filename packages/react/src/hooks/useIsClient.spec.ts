import { renderHook } from '@testing-library/react'
import { useState } from 'react'
import { useIsClient } from './useIsClient'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

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
