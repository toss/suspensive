import { type PropsWithChildren, type ReactNode, useContext, useState } from 'react'
import { DelayDefaultPropsContext } from './contexts'
import { useTimeout } from './hooks'
import { assert } from './utils'

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

  if (process.env.NODE_ENV !== 'production') {
    assert(delayMs >= 0, 'Delay: ms prop should be greater than or equal to 0')
  }

  const [isDelaying, setIsDelaying] = useState(delayMs > 0)
  useTimeout(() => setIsDelaying(false), delayMs)
  return isDelaying ? (typeof fallback === 'undefined' ? defaultProps.fallback : fallback) : children
}
if (process.env.NODE_ENV !== 'production') {
  Delay.displayName = 'Delay'
}
