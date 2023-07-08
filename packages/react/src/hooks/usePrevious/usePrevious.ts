import { useEffect, useRef } from 'react'

const usePrevious = <T>(value: T): T => {
  const ref = useRef<T>(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default usePrevious
