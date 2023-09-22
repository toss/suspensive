import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MS_100 } from '../utils/toTest'
import { useSetTimeout } from '.'

vi.useFakeTimers()

describe('useSetTimeout', () => {
  it('should run given function once after given timeout', () => {
    const fn = vi.fn()
    const rendered = renderHook(() => useSetTimeout(fn, MS_100))
    expect(fn).toHaveBeenCalledTimes(0)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(fn).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(fn).toHaveBeenCalledTimes(1)
    rendered.rerender()
    expect(fn).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
