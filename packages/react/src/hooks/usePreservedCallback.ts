import { useCallback, useEffect, useRef } from 'react'

export const usePreservedCallback = <T extends (...args: any[]) => unknown>(callback: T) => {
  const callbackRef = useRef<T>(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args)
  }, [])
}
