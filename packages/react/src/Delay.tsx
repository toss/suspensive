import type { ComponentProps, ComponentType, PropsWithChildren } from 'react'
import { createContext, useContext, useState } from 'react'
import { useTimeout } from './hooks'
import type { PropsWithoutChildren } from './types'
import { wrap } from './wrap'

export type DelayProps = PropsWithChildren<{
  ms?: number
}>

export const Delay = ({ ms, children }: DelayProps) => {
  const delayContextValue = useContext(DelayContext)
  const delayMs = ms ?? delayContextValue.ms ?? 0
  const [isDelayed, setIsDelayed] = useState(delayMs === 0)
  useTimeout(() => setIsDelayed(true), delayMs)
  return <>{isDelayed ? children : null}</>
}
if (process.env.NODE_ENV !== 'production') {
  Delay.displayName = 'Delay'
}

export const DelayContext = createContext<PropsWithoutChildren<DelayProps>>({ ms: 0 })

/**
 * @deprecated Use wrap.Delay().on as alternatives
 */
export const withDelay = <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
  component: ComponentType<TProps>,
  delayProps: PropsWithoutChildren<DelayProps> = {}
) => wrap.Delay(delayProps).on(component)
