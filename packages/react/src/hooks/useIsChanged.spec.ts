import { renderHook } from '@testing-library/react'
import { useIsChanged } from '.'

describe('useIsChanged', () => {
  it('should return boolean that express if given argument is changed value on previous render', () => {
    const { result, rerender } = renderHook<boolean, { count: number }>(({ count }) => useIsChanged(count), {
      initialProps: { count: 0 },
    })

    rerender({ count: 1 })
    expect(result.current).toBe(true)

    rerender({ count: 2 })
    expect(result.current).toBe(true)

    rerender({ count: 2 })
    expect(result.current).toBe(false)

    rerender({ count: 2 })
    expect(result.current).toBe(false)

    rerender({ count: 3 })
    expect(result.current).toBe(true)
  })
})
