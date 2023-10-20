import { renderHook } from '@testing-library/react'
import { useIsCSROnly } from '.'

describe('useIsCSROnly', () => {
  it('should return true when client side painting start', () => {
    const {
      result: { current: isClient },
    } = renderHook(() => useIsCSROnly())

    expect(isClient).toBe(true)
  })
})
