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

export const Delay = (props: DelayProps) => {
  const defaultProps = useContext(DelayDefaultPropsContext)

  const ms = props.ms ?? defaultProps.ms ?? 0
  if (process.env.NODE_ENV !== 'production') {
    assert(ms >= 0, 'Delay: ms prop should be greater than or equal to 0')
  }

  const [isDelaying, setIsDelaying] = useState(ms > 0)
  useTimeout(() => setIsDelaying(false), ms)

  const fallback = typeof props.fallback === 'undefined' ? defaultProps.fallback : props.fallback

  return isDelaying ? fallback : props.children
}
if (process.env.NODE_ENV !== 'production') {
  Delay.displayName = 'Delay'
}
