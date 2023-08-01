import { ComponentProps, ComponentRef, forwardRef } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { Suspense } from './Suspense'

type SuspenseProps = ComponentProps<typeof Suspense>
type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>
type AsyncBoundaryProps = Omit<SuspenseProps, 'fallback'> &
  Omit<ErrorBoundaryProps, 'fallback'> & {
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
const CSROnlyAsyncBoundary = forwardRef<ComponentRef<typeof ErrorBoundary>, AsyncBoundaryProps>(
  ({ pendingFallback, rejectedFallback, children, ...errorBoundaryProps }, resetRef) => (
    <ErrorBoundary {...errorBoundaryProps} ref={resetRef} fallback={rejectedFallback}>
      <Suspense.CSROnly fallback={pendingFallback}>{children}</Suspense.CSROnly>
    </ErrorBoundary>
  )
)
if (process.env.NODE_ENV !== 'production') {
  CSROnlyAsyncBoundary.displayName = 'AsyncBoundary.CSROnly'
}

/**
 * This component is just wrapping Suspense and ErrorBoundary in this library. to use Suspense with ErrorBoundary at once easily.
 * @see {@link https://suspensive.org/docs/react/src/AsyncBoundary.i18n Suspensive Official Docs}
 */
export const AsyncBoundary = BaseAsyncBoundary as typeof BaseAsyncBoundary & {
  /**
   * CSROnly mode make AsyncBoundary can be used in SSR framework like Next.js with React 17 or under
   * @see {@link https://suspensive.org/docs/react/src/AsyncBoundary.i18n Suspensive Official Docs}
   */
  CSROnly: typeof CSROnlyAsyncBoundary
}
AsyncBoundary.CSROnly = CSROnlyAsyncBoundary
