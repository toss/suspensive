import { act, renderHook } from '@testing-library/react'
import useRerender from './useRerender'

describe('useRerender', () => {
  it('should return function to rerender component when calling', () => {
    let renderCount = 0
    expect(renderCount).toBe(0)

    const { result: rerender } = renderHook(() => {
      const rerender = useRerender()
      renderCount = renderCount + 1
      return rerender
    })
    expect(renderCount).toBe(1)

    act(() => rerender.current())
    expect(renderCount).toBe(2)
  })
})
