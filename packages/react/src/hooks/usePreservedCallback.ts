import { useCallback, useRef } from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

export const usePreservedCallback = <T extends (...args: any[]) => unknown>(callback: T): T => {
  const callbackRef = useRef<T>(callback)

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args)
  }, []) as T
}
