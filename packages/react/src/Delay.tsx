import { type ReactElement, type ReactNode, useContext, useState } from 'react'
import { DelayDefaultPropsContext } from './contexts'
import { useTimeout } from './hooks'
import { Message_Delay_ms_prop_should_be_greater_than_or_equal_to_0, SuspensiveError } from './models/SuspensiveError'

export type DelayProps =
  | {
      ms?: number
      fallback?: never
      children?: ({ isDelayed }: { isDelayed: boolean }) => ReactElement
    }
  | {
      ms?: number
      fallback?: ReactNode
      children?: ReactNode
    }

export const Delay = (props: DelayProps) => {
  if (process.env.NODE_ENV === 'development' && typeof props.ms === 'number') {
    SuspensiveError.assert(props.ms >= 0, Message_Delay_ms_prop_should_be_greater_than_or_equal_to_0)
  }
  const defaultProps = useContext(DelayDefaultPropsContext)
  const ms = props.ms ?? defaultProps.ms ?? 0

  const [isDelayed, setIsDelayed] = useState(ms <= 0)
  useTimeout(() => setIsDelayed(true), ms)

  if (typeof props.children === 'function') {
    return props.children({ isDelayed })
  }

  const fallback = props.fallback === undefined ? defaultProps.fallback : props.fallback
  return <>{isDelayed ? props.children : fallback}</>
}
if (process.env.NODE_ENV === 'development') {
  Delay.displayName = 'Delay'
}
