import { renderHook, waitFor } from '@testing-library/react'
import { usePreservedCallback } from './usePreservedCallback'

describe('usePreservedCallback', () => {
  it('should preserve the callback function', () => {
    let counter = 0

    const { result, rerender } = renderHook(({ callback }) => usePreservedCallback(callback), {
      initialProps: {
        callback: () => counter,
      },
    })

    expect(result.current()).toBe(0)

    counter = 1
    rerender({ callback: () => counter })

    expect(result.current()).toBe(1)
  })

  it('should not recreate the callback on each render', () => {
    const callback = vi.fn()
    const { result, rerender } = renderHook(() => usePreservedCallback(callback))

    const preservedCallback = result.current

    rerender()
    expect(result.current).toBe(preservedCallback)
  })

  it('should call the latest callback', async () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const { result, rerender } = renderHook(({ callback }) => usePreservedCallback(callback), {
      initialProps: { callback: callback1 },
    })

    await waitFor(() => {
      result.current()
    })
    expect(callback1).toHaveBeenCalledTimes(1)

    rerender({ callback: callback2 })

    await waitFor(() => {
      result.current()
    })

    expect(callback2).toHaveBeenCalledTimes(1)
    expect(callback1).toHaveBeenCalledTimes(1)
  })
})
