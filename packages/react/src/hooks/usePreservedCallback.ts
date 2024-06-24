import { useCallback, useRef } from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

export const usePreservedCallback = <T extends (...args: unknown[]) => unknown>(callback: T) => {
  const callbackRef = useRef<T>(callback)

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback((...args: unknown[]) => {
    return callbackRef.current(...args)
  }, []) as T
}
