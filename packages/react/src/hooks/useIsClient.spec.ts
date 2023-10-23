import { renderHook } from '@testing-library/react'
import { useIsClient } from '.'

describe('useIsClient', () => {
  it('should return true when client side painting start', () => {
    const {
      result: { current: isClient },
    } = renderHook(() => useIsClient())

    expect(isClient).toBe(true)
  })
})
