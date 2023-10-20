import type { ReactNode } from 'react'

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

export const delay = (ms: number) => new Promise((resolve) => setTimeout(() => resolve('done'), ms))

export const TEXT = 'TEXT' as const
export const ERROR_MESSAGE = 'ERROR_MESSAGE' as const
export const FALLBACK = 'FALLBACK' as const
export const MS_100 = 100 as const
