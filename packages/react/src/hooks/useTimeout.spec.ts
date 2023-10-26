import { MS_100 } from '@suspensive/test-utils'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useTimeout } from '.'

vi.useFakeTimers()

describe('useTimeout', () => {
  it('should run given function once after given timeout', () => {
    const fn = vi.fn()
    const rendered = renderHook(() => useTimeout(fn, MS_100))
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
