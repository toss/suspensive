import { type PropsWithChildren, type ReactNode, useContext, useState } from 'react'
import { DelayDefaultPropsContext } from './contexts'
import { useTimeout } from './hooks'
import { Message_Delay_ms_prop_should_be_greater_than_or_equal_to_0, SuspensiveError } from './models/SuspensiveError'

export interface DelayProps extends PropsWithChildren {
  ms?: number
  fallback?: ReactNode
}

export const Delay = (props: DelayProps) => {
  if (process.env.NODE_ENV === 'development' && typeof props.ms === 'number') {
    SuspensiveError.assert(props.ms >= 0, Message_Delay_ms_prop_should_be_greater_than_or_equal_to_0)
  }
  const defaultProps = useContext(DelayDefaultPropsContext)
  const ms = props.ms ?? defaultProps.ms ?? 0

  const [isDelaying, setIsDelaying] = useState(ms > 0)
  useTimeout(() => setIsDelaying(false), ms)

  const fallback = props.fallback === undefined ? defaultProps.fallback : props.fallback
  return <>{isDelaying ? fallback : props.children}</>
}
if (process.env.NODE_ENV === 'development') {
  Delay.displayName = 'Delay'
}
