import { ComponentType } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { ComponentPropsWithoutChildren } from './types'

export const withErrorBoundary = <TProps extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<TProps>,
  errorBoundaryProps: ComponentPropsWithoutChildren<typeof ErrorBoundary>
) => {
  const Wrapped = (props: TProps) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withErrorBoundary(${name})`
  }

  return Wrapped
}
