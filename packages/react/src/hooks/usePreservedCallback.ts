import { useCallback, useRef } from 'react'

export const usePreservedCallback = <T extends (...args: any[]) => unknown>(callback: T): T => {
  const callbackRef = useRef<T>(callback)
  callbackRef.current = callback

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args)
  }, []) as T
}
