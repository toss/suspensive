import type { ComponentProps, ComponentType, ReactNode, SuspenseProps as ReactSuspenseProps } from 'react'
import { Suspense as ReactSuspense, createContext, useContext } from 'react'
import { useIsClient } from './hooks'
import type { PropsWithoutChildren } from './types'
import { wrap } from './wrap'

export type SuspenseProps = ReactSuspenseProps

export const SuspenseContext = createContext<PropsWithoutChildren<SuspenseProps>>({ fallback: undefined })
const useFallbackWithContext = (fallback: ReactNode) => {
  const contextFallback = useContext(SuspenseContext).fallback

  return fallback === null ? null : fallback ?? contextFallback
}

const DefaultSuspense = (props: SuspenseProps) => {
  const fallback = useFallbackWithContext(props.fallback)

  return <ReactSuspense {...props} fallback={fallback} />
}
if (process.env.NODE_ENV !== 'production') {
  DefaultSuspense.displayName = 'Suspense'
}
const CSROnlySuspense = (props: SuspenseProps) => {
  const isClient = useIsClient()
  const fallback = useFallbackWithContext(props.fallback)

  return isClient ? <ReactSuspense {...props} fallback={fallback} /> : <>{fallback}</>
}
if (process.env.NODE_ENV !== 'production') {
  CSROnlySuspense.displayName = 'Suspense.CSROnly'
}

/**
 * This component is just wrapping React's Suspense. to use Suspense easily in Server-side rendering environment like Next.js
 * @see {@link https://suspensive.org/docs/react/Suspense}
 */
export const Suspense = DefaultSuspense as typeof DefaultSuspense & {
  /**
   * CSROnly make Suspense can be used in SSR framework like Next.js with React 17 or under
   * @see {@link https://suspensive.org/docs/react/Suspense}
   */
  CSROnly: typeof CSROnlySuspense
}
Suspense.CSROnly = CSROnlySuspense

export const withSuspense = <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
  component: ComponentType<TProps>,
  suspenseProps: PropsWithoutChildren<SuspenseProps> = {}
) => wrap.Suspense(suspenseProps).on(component)
withSuspense.CSROnly = <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
  component: ComponentType<TProps>,
  suspenseProps: PropsWithoutChildren<SuspenseProps> = {}
) => wrap.Suspense.CSROnly(suspenseProps).on(component)
