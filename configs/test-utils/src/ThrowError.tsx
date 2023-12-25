import { type PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from 'react'

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const useTimeout = (fn: () => void, ms: number) => {
  const fnRef = useRef(fn)

  useIsomorphicLayoutEffect(() => {
    fnRef.current = fn
  }, [fn])

  useEffect(() => {
    const id = setTimeout(fnRef.current, ms)
    return () => clearTimeout(id)
  }, [ms])
}

const throwErrorIsNeed = { current: false }
type ThrowErrorProps = PropsWithChildren<{ message: string; after?: number }>
export const ThrowError = ({ message, after = 0, children }: ThrowErrorProps) => {
  const [isNeedError, setIsNeedError] = useState(after === 0 ? true : throwErrorIsNeed.current)
  if (isNeedError) {
    throw new Error(message)
  }
  useTimeout(() => setIsNeedError(true), after)
  return <>{children}</>
}

type ThrowNullProps = PropsWithChildren<{ after: number }>
export const ThrowNull = ({ after, children }: ThrowNullProps) => {
  const [isNeedError, setIsNeedError] = useState(throwErrorIsNeed.current)
  if (isNeedError) {
    throw null
  }
  useTimeout(() => setIsNeedError(true), after)
  return <>{children}</>
}

ThrowError.reset = () => {
  throwErrorIsNeed.current = false
}
