import type { ComponentProps, ComponentRef, ComponentType, SuspenseProps } from 'react'
import { forwardRef } from 'react'
import type { PropsWithoutDevMode } from './DevMode'
import { ErrorBoundary } from './ErrorBoundary'
import type { ErrorBoundaryProps } from './ErrorBoundary'
import { Suspense } from './Suspense'
import type { PropsWithoutChildren } from './types'

/**
 * @deprecated Use SuspenseProps and ErrorBoundaryProps as alternatives
 */
export type AsyncBoundaryProps = Omit<PropsWithoutDevMode<SuspenseProps>, 'fallback'> &
  Omit<PropsWithoutDevMode<ErrorBoundaryProps>, 'fallback'> & {
    pendingFallback?: SuspenseProps['fallback']
    rejectedFallback: ErrorBoundaryProps['fallback']
  }

const BaseAsyncBoundary = forwardRef<ComponentRef<typeof ErrorBoundary>, AsyncBoundaryProps>(
  ({ pendingFallback, rejectedFallback, children, ...errorBoundaryProps }, resetRef) => (
    <ErrorBoundary {...errorBoundaryProps} ref={resetRef} fallback={rejectedFallback}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
)
if (process.env.NODE_ENV !== 'production') {
  BaseAsyncBoundary.displayName = 'AsyncBoundary'
}
const CSROnly = forwardRef<ComponentRef<typeof ErrorBoundary>, AsyncBoundaryProps>(
  ({ pendingFallback, rejectedFallback, children, ...errorBoundaryProps }, resetRef) => (
    <ErrorBoundary {...errorBoundaryProps} ref={resetRef} fallback={rejectedFallback}>
      <Suspense.CSROnly fallback={pendingFallback}>{children}</Suspense.CSROnly>
    </ErrorBoundary>
  )
)
if (process.env.NODE_ENV !== 'production') {
  CSROnly.displayName = 'AsyncBoundary.CSROnly'
}

/**
 * @deprecated Use `<Suspense/>` and `<ErrorBoundary/>` as alternatives
 */
export const AsyncBoundary = Object.assign(BaseAsyncBoundary, {
  /**
   * @deprecated Use `<Suspense/>` and `<ErrorBoundary/>` as alternatives
   */
  CSROnly,
})

/**
 * @deprecated Use wrap.ErrorBoundary().Suspense().on as alternatives
 */
export const withAsyncBoundary = Object.assign(
  <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
    Component: ComponentType<TProps>,
    asyncBoundaryProps: PropsWithoutChildren<AsyncBoundaryProps>
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
  },
  {
    /**
     * @deprecated Use wrap.ErrorBoundary().Suspense.CSROnly().on as alternatives
     */
    CSROnly: <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
      Component: ComponentType<TProps>,
      asyncBoundaryProps: PropsWithoutChildren<AsyncBoundaryProps>
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
    },
  }
)
