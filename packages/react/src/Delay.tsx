import { type PropsWithChildren, type ReactNode, useContext, useState } from 'react'
import { AssertionError } from './AssertionError'
import { DelayDefaultPropsContext } from './contexts'
import { useTimeout } from './hooks'
import { DelayMsPropShouldBeGreaterThanOrEqualTo0 } from './utils/assert'

export interface DelayProps extends PropsWithChildren {
  ms?: number
  /**
   * @experimental This is experimental feature.
   */
  fallback?: ReactNode
}

export const Delay = (props: DelayProps) => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof props.ms === 'number') {
      AssertionError.assert(props.ms >= 0, DelayMsPropShouldBeGreaterThanOrEqualTo0)
    }
  }
  const defaultProps = useContext(DelayDefaultPropsContext)
  const ms = props.ms ?? defaultProps.ms ?? 0

  const [isDelaying, setIsDelaying] = useState(ms > 0)
  useTimeout(() => setIsDelaying(false), ms)

  const fallback = typeof props.fallback === 'undefined' ? defaultProps.fallback : props.fallback
  return isDelaying ? fallback : props.children
}
if (process.env.NODE_ENV === 'development') {
  Delay.displayName = 'Delay'
}
