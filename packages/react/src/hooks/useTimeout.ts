import { useEffect } from 'react'
import { usePreservedCallback } from './usePreservedCallback'

export const useTimeout = (fn: () => void, ms: number) => {
  const preservedCallback = usePreservedCallback(fn)

  useEffect(() => {
    const id = setTimeout(preservedCallback, ms)
    return () => clearTimeout(id)
  }, [preservedCallback, ms])
}
