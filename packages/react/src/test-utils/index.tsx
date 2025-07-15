import { type PropsWithChildren, type ReactNode, useState } from 'react'
import { useTimeout } from '../hooks/useTimeout'

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
      // eslint-disable-next-line @typescript-eslint/only-throw-error
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

export class CustomError extends Error {
  constructor(...args: ConstructorParameters<ErrorConstructor>) {
    super(...args)
    console.error(...args)
  }
}

const isNeedSuspendGlobal = { current: true }

export const Suspend = ({ during, toShow }: { during: number; toShow?: ReactNode }) => {
  if (isNeedSuspendGlobal.current) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
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

export default function Component() {
  return <div>Component</div>
}
