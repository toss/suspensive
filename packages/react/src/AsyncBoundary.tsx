import { type ComponentRef, type SuspenseProps, forwardRef } from 'react'
import { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary'
import { Suspense } from './Suspense'
import type { PropsWithoutDevMode } from './utility-types'

/**
 * @deprecated Use SuspenseProps and ErrorBoundaryProps instead
 */
export interface AsyncBoundaryProps
  extends Omit<PropsWithoutDevMode<SuspenseProps>, 'fallback'>,
    Omit<PropsWithoutDevMode<ErrorBoundaryProps>, 'fallback'> {
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
 * @deprecated Use `<Suspense/>` and `<ErrorBoundary/>` instead
 */
export const AsyncBoundary = Object.assign(BaseAsyncBoundary, {
  /**
   * @deprecated Use `<Suspense csrOnly />` and `<ErrorBoundary/>` instead
   */
  CSROnly,
})
