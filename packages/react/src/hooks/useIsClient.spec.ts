import { renderHook } from '@testing-library/react'
import { useState, useSyncExternalStore } from 'react'
import { noop } from '../utils'
import { useIsClient, useIsomorphicLayoutEffect } from '.'

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

    let renderCount = 0
    let chanceIsClientToBeFalse = false

    const emptySubscribe = () => noop
    const getSnapshot = () => true
    const getServerSnapshot = () => false
    const useIsClient = () => {
      const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
      renderCount++
      if (!isClient) {
        chanceIsClientToBeFalse = true
      }
      return isClient
    }
    const { unmount } = renderHook(() => useIsClient())
    expect(renderCount).toBe(1)
    expect(chanceIsClientToBeFalse).toBe(false)
    unmount()
    renderHook(() => useIsClient())
    expect(renderCount).toBe(2)
    expect(chanceIsClientToBeFalse).toBe(false)
  })
  it('improve legacy useIsClientOnly', () => {
    // check CSR environment first
    expect(typeof document !== 'undefined').toBe(true)

    let renderCount = 0
    let chanceIsClientToBeFalse = false

    /**
     * @deprecated This is legacy useIsClientOnly
     */
    const useIsClientLegacy = () => {
      renderCount++
      const [isClient, setIsClient] = useState(false)
      if (!isClient) {
        chanceIsClientToBeFalse = true
      }
      useIsomorphicLayoutEffect(() => {
        setIsClient(true)
      }, [])

      return isClient
    }
    const { unmount } = renderHook(() => useIsClientLegacy())
    expect(renderCount).toBe(2)
    expect(chanceIsClientToBeFalse).toBe(true)
    unmount()
    renderHook(() => useIsClientLegacy())
    expect(renderCount).toBe(4)
    expect(chanceIsClientToBeFalse).toBe(true)
  })
})
