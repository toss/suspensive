import { type ReactNode, useContext, useState } from 'react'
import { DelayDefaultPropsContext } from './contexts'
import { useTimeout } from './hooks'
import { Message_Delay_ms_prop_should_be_greater_than_or_equal_to_0, SuspensiveError } from './models/SuspensiveError'

export type DelayProps =
  | {
      ms?: number
      fallback?: never
      /**
       * @experimental This is experimental feature.
       */
      children?: ({ isDelayed }: { isDelayed: boolean }) => ReactNode
    }
  | {
      ms?: number
      fallback?: ReactNode
      children?: ReactNode
    }

/**
 * This component delays the rendering of its children for a specified duration.
 *
 * The Delay component provides a way to introduce intentional delays in rendering,
 * which can be useful for loading states or animations.
 * @see {@link https://suspensive.org/docs/react/Delay Suspensive Docs}
 */
export const Delay = (props: DelayProps) => {
  if (process.env.NODE_ENV === 'development' && typeof props.ms === 'number') {
    SuspensiveError.assert(props.ms >= 0, Message_Delay_ms_prop_should_be_greater_than_or_equal_to_0)
  }
  const defaultProps = useContext(DelayDefaultPropsContext)
  const ms = props.ms ?? defaultProps.ms ?? 0

  const [isDelayed, setIsDelayed] = useState(ms <= 0)
  useTimeout(() => setIsDelayed(true), ms)

  if (typeof props.children === 'function') {
    return <>{props.children({ isDelayed })}</>
  }

  if (isDelayed) {
    return <>{props.children}</>
  }
  if (props.fallback === undefined) {
    return <>{defaultProps.fallback}</>
  }
  return <>{props.fallback}</>
}
if (process.env.NODE_ENV === 'development') {
  Delay.displayName = 'Delay'
}
