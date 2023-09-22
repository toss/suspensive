import { useEffect } from 'react'

export const useSetTimeout = (fn: (...args: []) => void, delay: number) =>
  useEffect(() => {
    const timeout = setTimeout(fn, delay)
    return () => clearTimeout(timeout)
  }, [fn, delay])
