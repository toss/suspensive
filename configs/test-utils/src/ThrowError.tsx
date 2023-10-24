import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'

const useSetTimeout = (fn: (...args: []) => void, delay: number) =>
  useEffect(() => {
    const timeout = setTimeout(fn, delay)
    return () => clearTimeout(timeout)
  }, [fn, delay])

const throwErrorIsNeed = { current: false }
type ThrowErrorProps = PropsWithChildren<{ message: string; after?: number }>
export const ThrowError = ({ message, after = 0, children }: ThrowErrorProps) => {
  const [isNeedError, setIsNeedError] = useState(after === 0 ? true : throwErrorIsNeed.current)
  if (isNeedError) {
    throw new Error(message)
  }
  useSetTimeout(() => setIsNeedError(true), after)
  return <>{children}</>
}

type ThrowNullProps = PropsWithChildren<{ after: number }>
export const ThrowNull = ({ after, children }: ThrowNullProps) => {
  const [isNeedError, setIsNeedError] = useState(throwErrorIsNeed.current)
  if (isNeedError) {
    throw null
  }
  useSetTimeout(() => setIsNeedError(true), after)
  return <>{children}</>
}

ThrowError.reset = () => {
  throwErrorIsNeed.current = false
}
