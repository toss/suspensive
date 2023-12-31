import { type PropsWithChildren, useContext, useState } from 'react'
import { DelayDefaultPropsContext } from './contexts'
import { useTimeout } from './hooks'

export interface DelayProps extends PropsWithChildren {
  ms?: number
}

export const Delay = ({ ms, children }: DelayProps) => {
  const defaultProps = useContext(DelayDefaultPropsContext)
  const delayMs = ms ?? defaultProps.ms ?? 0
  const [isDelayed, setIsDelayed] = useState(delayMs === 0)
  useTimeout(() => setIsDelayed(true), delayMs)
  return <>{isDelayed ? children : null}</>
}
if (process.env.NODE_ENV !== 'production') {
  Delay.displayName = 'Delay'
}
