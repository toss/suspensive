import type { PropsWithChildren } from 'react'
import { useContext, useState } from 'react'
import { DelayDefaultOptionsContext } from './contexts'
import { useTimeout } from './hooks'

export interface DelayProps extends PropsWithChildren {
  ms?: number
}

export const Delay = ({ ms, children }: DelayProps) => {
  const delayDefaultOptions = useContext(DelayDefaultOptionsContext)
  const delayMs = ms ?? delayDefaultOptions.ms ?? 0
  const [isDelayed, setIsDelayed] = useState(delayMs === 0)
  useTimeout(() => setIsDelayed(true), delayMs)
  return <>{isDelayed ? children : null}</>
}
if (process.env.NODE_ENV !== 'production') {
  Delay.displayName = 'Delay'
}
