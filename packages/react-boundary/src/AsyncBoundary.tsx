import { ComponentProps, forwardRef } from 'react'
import { ErrorBoundary, ResetRef } from './ErrorBoundary'
import { Suspense } from './Suspense'

type SuspenseProps = ComponentProps<typeof Suspense>
type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>
type Props = Omit<SuspenseProps, 'fallback'> &
  Omit<ErrorBoundaryProps, 'fallback'> & {
    pendingFallback: SuspenseProps['fallback']
    rejectedFallback: ErrorBoundaryProps['fallback']
  }

const BaseAsyncBoundary = forwardRef<ResetRef, Props>(
  ({ pendingFallback, rejectedFallback, children, ...errorBoundaryProps }, resetRef) => (
    <ErrorBoundary {...errorBoundaryProps} ref={resetRef} fallback={rejectedFallback}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
)
const CSROnlyAsyncBoundary = forwardRef<ResetRef, Props>(
  ({ pendingFallback, rejectedFallback, children, ...errorBoundaryProps }, resetRef) => (
    <ErrorBoundary {...errorBoundaryProps} ref={resetRef} fallback={rejectedFallback}>
      <Suspense.CSROnly fallback={pendingFallback}>{children}</Suspense.CSROnly>
    </ErrorBoundary>
  )
)

export const AsyncBoundary = BaseAsyncBoundary as typeof BaseAsyncBoundary & {
  CSROnly: typeof CSROnlyAsyncBoundary
}
AsyncBoundary.CSROnly = CSROnlyAsyncBoundary
