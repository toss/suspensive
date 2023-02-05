import { ComponentType, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { ComponentPropsWithoutChildren } from './types'

export const DelayContext = createContext<{ ms?: number }>({ ms: 0 })

type DelayProps = { ms?: number; children: ReactNode }
/**
 * @experimental This is experimental feature.
 */
export const Delay = ({ ms, children }: DelayProps) => {
  const delayMs = ms ?? useContext(DelayContext).ms ?? 0
  const [isDelayed, setIsDelayed] = useState(delayMs === 0)

  useEffect(() => {
    const timerId = setTimeout(() => !isDelayed && setIsDelayed(true), delayMs)
    return () => clearTimeout(timerId)
  }, [delayMs])

  return <>{isDelayed ? children : null}</>
}

/**
 * @experimental This is experimental feature.
 */
export const withDelay = <Props extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<Props>,
  delayProps?: ComponentPropsWithoutChildren<typeof Delay>
) => {
  const Wrapped = (props: Props) => (
    <Delay {...delayProps}>
      <Component {...props} />
    </Delay>
  )

  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withDelay(${name})`
  }

  return Wrapped
}
