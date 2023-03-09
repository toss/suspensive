import { ComponentType, ReactNode, Suspense as ReactSuspense, SuspenseProps, createContext, useContext } from 'react'
import { useIsMounted } from './hooks'
import { ComponentPropsWithoutChildren } from './types'

export const SuspenseContext = createContext<{ fallback?: ReactNode }>({ fallback: undefined })
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
  const isMounted = useIsMounted()
  const fallback = useFallbackWithContext(props.fallback)

  return isMounted ? <ReactSuspense {...props} fallback={fallback} /> : <>{fallback}</>
}
if (process.env.NODE_ENV !== 'production') {
  CSROnlySuspense.displayName = 'Suspense.CSROnly'
}

/**
 * This component is just wrapping React's Suspense. to use Suspense easily in Server-side rendering environment like Next.js
 * @see {@link https://suspensive.org/docs/react/src/Suspense.i18n Suspensive Official Docs}
 */
export const Suspense = DefaultSuspense as typeof DefaultSuspense & {
  /**
   * CSROnly mode make Suspense can be used in SSR framework like Next.js with React 17 or under
   * @see {@link https://suspensive.org/docs/react/src/Suspense.i18n Suspensive Official Docs}
   */
  CSROnly: typeof CSROnlySuspense
}
Suspense.CSROnly = CSROnlySuspense

export function withSuspense<Props extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<Props>,
  suspenseProps?: ComponentPropsWithoutChildren<typeof Suspense>
) {
  const Wrapped = (props: Props) => (
    <Suspense {...suspenseProps}>
      <Component {...props} />
    </Suspense>
  )

  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withSuspense(${name})`
  }

  return Wrapped
}

withSuspense.CSROnly = function withSuspenseCSROnly<Props extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<Props>,
  suspenseProps?: ComponentPropsWithoutChildren<typeof Suspense.CSROnly>
) {
  const Wrapped = (props: Props) => (
    <Suspense.CSROnly {...suspenseProps}>
      <Component {...props} />
    </Suspense.CSROnly>
  )

  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withSuspense.CSROnly(${name})`
  }

  return Wrapped
}
