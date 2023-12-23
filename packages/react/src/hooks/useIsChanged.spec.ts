import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePrevious } from './useIsChanged'
import { useIsChanged } from '.'

describe('usePrevious', () => {
  it('should return value given as an argument in the previous rendering', () => {
    const { result, rerender } = renderHook<{ now: number; prev: number }, { count: number }>(
      ({ count }) => ({ prev: usePrevious(count), now: count }),
      { initialProps: { count: 0 } }
    )

    rerender({ count: 1 })
    expect(result.current.prev).toBe(0)
    expect(result.current.now).toBe(1)

    rerender({ count: 2 })
    expect(result.current.prev).toBe(1)
    expect(result.current.now).toBe(2)

    rerender({ count: 3 })
    expect(result.current.prev).toBe(2)
    expect(result.current.now).toBe(3)
  })
})

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
