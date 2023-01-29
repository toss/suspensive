import { Suspense as BaseSuspense, ComponentType, SuspenseProps } from 'react'
import { useIsMounted } from './hooks'
import { ComponentPropsWithoutChildren } from './types'
import { isDevelopment } from './utils'

const DefaultSuspense = (props: SuspenseProps) => <BaseSuspense {...props} />
if (isDevelopment) {
  DefaultSuspense.displayName = 'Suspense'
}
const CSROnlySuspense = (props: SuspenseProps) => (useIsMounted() ? <BaseSuspense {...props} /> : <>{props.fallback}</>)
if (isDevelopment) {
  CSROnlySuspense.displayName = 'Suspense.CSROnly'
}

/**
 * This component is just wrapping React's Suspense. to use Suspense easily in Server-side rendering environment like Next.js
 * @see {@link https://docs.suspensive.org/docs/react/src/Suspense.i18n Suspensive Official Docs}
 */
export const Suspense = DefaultSuspense as typeof DefaultSuspense & {
  /**
   * CSROnly mode make Suspense can be used in SSR framework like Next.js with React 17 or under
   * @see {@link https://docs.suspensive.org/docs/react/src/Suspense.i18n Suspensive Official Docs}
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

  if (isDevelopment) {
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

  if (isDevelopment) {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withSuspense.CSROnly(${name})`
  }

  return Wrapped
}
