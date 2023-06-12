import { ReactNode } from 'react'

const suspendIsNeed = { current: true }

const suspend = (during: number) => {
  throw new Promise((resolve) =>
    setTimeout(() => {
      suspendIsNeed.current = false
      resolve('resolved')
    }, during)
  )
}

export const Suspend = ({ during = Infinity, toShow }: { during: number; toShow?: ReactNode }) => {
  if (suspendIsNeed.current) {
    suspend(during)
  }
  return <>{toShow}</>
}
Suspend.reset = () => {
  suspendIsNeed.current = true
}

export const TEXT = 'TEXT'
export const FALLBACK = 'FALLBACK'
export const MS_100 = 100
