import type { ComponentProps, ComponentType, PropsWithChildren } from 'react'
import { createContext, useContext, useState } from 'react'
import { useSetTimeout } from './hooks'
import type { PropsWithoutChildren } from './types'

type DelayProps = PropsWithChildren<{
  ms?: number
}>
export const Delay = ({ ms, children }: DelayProps) => {
  const delayContextValue = useContext(DelayContext)
  const delayMs = ms ?? delayContextValue.ms ?? 0
  const [isDelayed, setIsDelayed] = useState(delayMs === 0)
  useSetTimeout(() => setIsDelayed(true), delayMs)
  return <>{isDelayed ? children : null}</>
}

export const DelayContext = createContext<PropsWithoutChildren<DelayProps>>({ ms: 0 })

// HOC
export const withDelay = <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
  Component: ComponentType<TProps>,
  delayProps?: PropsWithoutChildren<DelayProps>
) => {
  const Wrapped = (props: TProps) => (
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
