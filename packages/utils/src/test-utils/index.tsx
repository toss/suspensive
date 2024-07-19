import { type PropsWithChildren, type ReactNode, useState } from 'react'
import { useTimeout } from '../useTimeout'

const isNeedThrowGlobal = { current: false }

export const Throw = {
  Error: ({ message, after = 0, children }: PropsWithChildren<{ message: string; after?: number }>) => {
    const [isNeedThrow, setIsNeedThrow] = useState(after === 0 ? true : isNeedThrowGlobal.current)
    if (isNeedThrow) {
      throw new Error(message)
    }
    useTimeout(() => setIsNeedThrow(true), after)
    return <>{children}</>
  },
  Null: ({ after, children }: PropsWithChildren<{ after: number }>) => {
    const [isNeedError, setIsNeedError] = useState(isNeedThrowGlobal.current)
    if (isNeedError) {
      throw null
    }
    useTimeout(() => setIsNeedError(true), after)
    return <>{children}</>
  },
  reset: () => {
    isNeedThrowGlobal.current = false
  },
}

export const TEXT = 'TEXT'
export const ERROR_MESSAGE = 'ERROR_MESSAGE'
export const FALLBACK = 'FALLBACK'
export const sleep = (ms: number) => new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), ms))
export const queryKey = ['key'] as const
export const queryFn = () => sleep(10).then(() => ({ text: 'response' }))
export const boolean = Math.random() > 0.5
export const select = (data: Awaited<ReturnType<typeof queryFn>>) => data.text

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

const isNeedSuspendGlobal = { current: true }

export const Suspend = ({ during, toShow }: { during: number; toShow?: ReactNode }) => {
  if (isNeedSuspendGlobal.current) {
    throw new Promise((resolve) =>
      setTimeout(() => {
        isNeedSuspendGlobal.current = false
        resolve('resolved')
      }, during)
    )
  }
  return toShow
}
Suspend.reset = () => {
  isNeedSuspendGlobal.current = true
}
