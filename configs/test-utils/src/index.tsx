import { type PropsWithChildren, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'

export const sleep = (ms: number) => new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), ms))

export class CustomError extends Error {
  constructor(...args: ConstructorParameters<ErrorConstructor>) {
    super(...args)
    console.error(...args)
  }
}
export class CustomNotError {
  constructor(public message?: string) {
    console.log(message)
  }
}

const suspendIsNeed = { current: true }
type SuspendProps = { during: number; toShow?: ReactNode }
export const Suspend = ({ during, toShow }: SuspendProps) => {
  if (suspendIsNeed.current) {
    throw new Promise((resolve) =>
      setTimeout(() => {
        suspendIsNeed.current = false
        resolve('resolved')
      }, during)
    )
  }
  return <>{toShow}</>
}
Suspend.reset = () => {
  suspendIsNeed.current = true
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const useTimeout = (fn: () => void, ms: number) => {
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

export const TEXT = 'TEXT' as const
export const ERROR_MESSAGE = 'ERROR_MESSAGE' as const
export const FALLBACK = 'FALLBACK' as const

export const queryKey = ['key'] as const
export const queryFn = () => sleep(10).then(() => ({ text: 'response' }))
export const boolean = Math.random() > 0.5
export const select = (data: Awaited<ReturnType<typeof queryFn>>) => data.text
