import { ComponentType } from 'react'
import { AsyncBoundary } from './AsyncBoundary'
import { ComponentPropsWithoutChildren } from './types'

export const withAsyncBoundary = <Props extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<Props>,
  asyncBoundaryProps: ComponentPropsWithoutChildren<typeof AsyncBoundary>
) => {
  const Wrapped = (props: Props) => (
    <AsyncBoundary {...asyncBoundaryProps}>
      <Component {...props} />
    </AsyncBoundary>
  )

  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withAsyncBoundary(${name})`
  }

  return Wrapped
}
withAsyncBoundary.CSROnly = <Props extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<Props>,
  asyncBoundaryProps: ComponentPropsWithoutChildren<typeof AsyncBoundary.CSROnly>
) => {
  const Wrapped = (props: Props) => (
    <AsyncBoundary.CSROnly {...asyncBoundaryProps}>
      <Component {...props} />
    </AsyncBoundary.CSROnly>
  )

  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withAsyncBoundary.CSROnly(${name})`
  }

  return Wrapped
}
