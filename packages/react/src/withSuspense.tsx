import { ComponentType } from 'react'
import { Suspense } from './Suspense'
import { ComponentPropsWithoutChildren } from './types'

export function withSuspense<TProps extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<TProps>,
  suspenseProps?: ComponentPropsWithoutChildren<typeof Suspense>
) {
  const Wrapped = (props: TProps) => (
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

withSuspense.CSROnly = function withSuspenseCSROnly<TProps extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<TProps>,
  suspenseProps?: ComponentPropsWithoutChildren<typeof Suspense.CSROnly>
) {
  const Wrapped = (props: TProps) => (
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
