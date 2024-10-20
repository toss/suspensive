import { useCallback, useEffect, useRef } from 'react'

export const useTimeout = (fn: () => void, ms: number) => {
  const fnRef = useRef(fn)
  fnRef.current = fn
  const fnPreserved = useCallback(() => fnRef.current(), [])
  useEffect(() => {
    const id = setTimeout(fnPreserved, ms)
    return () => clearTimeout(id)
  }, [fnPreserved, ms])
}
