import { act, renderHook } from '@testing-library/react'
import useKey from './useKey'

const INITIAL_VALUE = 0

describe('useKey', () => {
  describe('refresh function', () => {
    it('should update key state', async () => {
      const { result } = renderHook(() => useKey())

      expect(result.current[0]).toBe(INITIAL_VALUE)

      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe(INITIAL_VALUE + 1)
    })

    it('should update key state not only one', async () => {
      const { result } = renderHook(() => useKey())

      expect(result.current[0]).toBe(INITIAL_VALUE)

      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe(INITIAL_VALUE + 1)

      act(() => {
        result.current[1]()
      })
      expect(result.current[0]).toBe(INITIAL_VALUE + 2)
    })
  })
})
