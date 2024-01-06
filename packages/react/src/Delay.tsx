import { type PropsWithChildren, type ReactNode, useContext, useState } from 'react'
import { DelayDefaultPropsContext } from './contexts'
import { useTimeout } from './hooks'

export interface DelayProps extends PropsWithChildren {
  ms?: number
  /**
   * @experimental This is experimental feature.
   */
  fallback?: ReactNode
}

export const Delay = ({ ms, children, fallback }: DelayProps) => {
  const defaultProps = useContext(DelayDefaultPropsContext)
  const delayMs = ms ?? defaultProps.ms ?? 0
  const [isDelayed, setIsDelayed] = useState(delayMs === 0)
  useTimeout(() => setIsDelayed(true), delayMs)
  return <>{isDelayed ? children : typeof fallback === 'undefined' ? defaultProps.fallback : fallback}</>
}
if (process.env.NODE_ENV !== 'production') {
  Delay.displayName = 'Delay'
}
