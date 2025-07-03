import { renderHook } from '@testing-library/react'
import { useEffect, useLayoutEffect, useState } from 'react'
import reactDomServer from 'react-dom/server'
import { useIsClient } from './useIsClient'

const importUseIsomorphicLayoutEffect = () => {
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

  return { useIsomorphicLayoutEffect }
}
describe('useIsomorphicLayoutEffect', () => {
  const originalWindow = global.window
  afterEach(() => vi.resetModules())
  it('should use useEffect in server environment', () => {
    Object.defineProperty(global, 'window', {
      value: undefined,
    })
    const { useIsomorphicLayoutEffect } = importUseIsomorphicLayoutEffect()
    expect(useIsomorphicLayoutEffect).toEqual(useEffect)
  })

  it('should use useLayoutEffect in client environment', () => {
    Object.defineProperty(global, 'window', {
      value: originalWindow,
    })
    const { useIsomorphicLayoutEffect } = importUseIsomorphicLayoutEffect()
    expect(useIsomorphicLayoutEffect).toEqual(useLayoutEffect)
  })
})

describe('useIsClient', () => {
  it('should return true in client-side rendering', () => {
    const returnedFirst = renderHook(() => useIsClient())
    expect(returnedFirst.result.current).toBe(true)
    returnedFirst.unmount()
    const returnedSecond = renderHook(() => useIsClient())
    expect(returnedSecond.result.current).toBe(true)
  })
  it('should return false in server-side rendering', () => {
    const TestComponent = () => useIsClient().toString()
    expect(reactDomServer.renderToString(<TestComponent />)).toBe('false')
  })
  it('should match behavior of legacy useIsClientOnly', () => {
    // check CSR environment first
    expect(typeof document !== 'undefined').toBe(true)
    const mockUseIsClient = vi.fn(useIsClient)
    const { unmount } = renderHook(() => mockUseIsClient())
    expect(mockUseIsClient).toBeCalledTimes(1)
    unmount()
    renderHook(() => mockUseIsClient())
    expect(mockUseIsClient).toBeCalledTimes(2)
  })
  it('should improve legacy useIsClientOnly', () => {
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
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const { unmount } = renderHook(() => mockUseIsClientLegacy())
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expect(mockUseIsClientLegacy).toBeCalledTimes(2)
    expect(chanceIsClientToBeFalse).toBe(true)
    unmount()
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    renderHook(() => mockUseIsClientLegacy())
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expect(mockUseIsClientLegacy).toBeCalledTimes(4)
    expect(chanceIsClientToBeFalse).toBe(true)
  })
})
