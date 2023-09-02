import { ComponentType } from 'react'
import { ErrorBoundaryGroup } from './ErrorBoundaryGroup'
import { ComponentPropsWithoutChildren } from './types'

export const withErrorBoundaryGroup = <TProps extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<TProps>,
  errorBoundaryGroupProps?: ComponentPropsWithoutChildren<typeof ErrorBoundaryGroup>
) => {
  const Wrapped = (props: TProps) => (
    <ErrorBoundaryGroup {...errorBoundaryGroupProps}>
      <Component {...props} />
    </ErrorBoundaryGroup>
  )

  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withErrorBoundaryGroup(${name})`
  }

  return Wrapped
}
