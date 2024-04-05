import { type ComponentRef, forwardRef } from 'react'
import { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary'
import { Suspense, type SuspenseProps } from './Suspense'
import type { OmitKeyof } from './utility-types'

/**
 * @deprecated Use SuspenseProps and ErrorBoundaryProps instead
 */
export interface AsyncBoundaryProps
  extends OmitKeyof<SuspenseProps, 'fallback' | 'devMode'>,
    OmitKeyof<ErrorBoundaryProps, 'fallback' | 'devMode'> {
  pendingFallback?: SuspenseProps['fallback']
  rejectedFallback: ErrorBoundaryProps['fallback']
}

/**
 * @deprecated Use `<Suspense/>` and `<ErrorBoundary/>` instead
 */
export const AsyncBoundary = Object.assign(
  (() => {
    const BaseAsyncBoundary = forwardRef<ComponentRef<typeof ErrorBoundary>, AsyncBoundaryProps>(
      ({ clientOnly, pendingFallback, rejectedFallback, children, ...errorBoundaryProps }, resetRef) => (
        <ErrorBoundary {...errorBoundaryProps} ref={resetRef} fallback={rejectedFallback}>
          <Suspense clientOnly={clientOnly} fallback={pendingFallback}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )
    )
    if (process.env.NODE_ENV === 'development') {
      BaseAsyncBoundary.displayName = 'AsyncBoundary'
    }

    return BaseAsyncBoundary
  })(),
  {
    /**
     * @deprecated Use `<Suspense clientOnly />` and `<ErrorBoundary/>` instead
     */
    CSROnly: (() => {
      const CSROnly = forwardRef<ComponentRef<typeof ErrorBoundary>, OmitKeyof<AsyncBoundaryProps, 'clientOnly'>>(
        ({ pendingFallback, rejectedFallback, children, ...errorBoundaryProps }, resetRef) => (
          <ErrorBoundary {...errorBoundaryProps} ref={resetRef} fallback={rejectedFallback}>
            <Suspense clientOnly fallback={pendingFallback}>
              {children}
            </Suspense>
          </ErrorBoundary>
        )
      )
      if (process.env.NODE_ENV === 'development') {
        CSROnly.displayName = 'AsyncBoundary.CSROnly'
      }

      return CSROnly
    })(),
  }
)
