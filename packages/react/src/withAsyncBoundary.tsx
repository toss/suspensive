import { ComponentType } from 'react'
import { AsyncBoundary } from './AsyncBoundary'
import { ComponentPropsWithoutChildren } from './types'

export const withAsyncBoundary = <TProps extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<TProps>,
  asyncBoundaryProps: ComponentPropsWithoutChildren<typeof AsyncBoundary>
) => {
  const Wrapped = (props: TProps) => (
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
withAsyncBoundary.CSROnly = <TProps extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<TProps>,
  asyncBoundaryProps: ComponentPropsWithoutChildren<typeof AsyncBoundary.CSROnly>
) => {
  const Wrapped = (props: TProps) => (
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
