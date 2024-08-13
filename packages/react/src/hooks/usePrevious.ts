import { useEffect, useRef } from 'react'

export const usePrevious = <TValue>(value: TValue): TValue => {
  const ref = useRef<TValue>(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
