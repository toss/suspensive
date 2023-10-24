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
