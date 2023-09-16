import { act, renderHook } from '@testing-library/react'
import { useKey } from '.'

describe('useKey', () => {
  describe('refresh function', () => {
    it('should increment the key state by 1', () => {
      const { result } = renderHook(() => useKey())

      const initialKey = result.current[0]
      const refresh = result.current[1]

      expect(initialKey).toBe(0)
      act(refresh)
      expect(result.current[0]).toBe(initialKey + 1)
      act(refresh)
      expect(result.current[0]).toBe(initialKey + 2)
    })
  })
})
