import { ComponentProps, forwardRef, useImperativeHandle, useRef } from 'react'
import { ErrorBoundary, Suspense } from '.'

type SuspenseProps = ComponentProps<typeof Suspense>
type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>

interface Props extends Omit<SuspenseProps, 'fallback'>, Omit<ErrorBoundaryProps, 'fallback'> {
  pendingFallback: SuspenseProps['fallback']
  rejectedFallback: ErrorBoundaryProps['fallback']
}

interface ResetRef {
  reset?(): void
}

const BaseAsyncBoundary = forwardRef<ResetRef, Props>(function BaseAsyncBoundary(
  { pendingFallback, rejectedFallback, children, ...errorBoundaryProps },
  resetRef
) {
  const ref = useRef<ErrorBoundary | null>(null)

  useImperativeHandle(resetRef, () => ({
    reset: () => ref.current?.resetErrorBoundary(),
  }))

  return (
    <ErrorBoundary {...errorBoundaryProps} ref={ref} fallback={rejectedFallback}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
})

const CSROnlyAsyncBoundary = forwardRef<ResetRef, Props>(function CSROnlyAsyncBoundary(
  { pendingFallback, rejectedFallback, children, ...errorBoundaryProps },
  resetRef
) {
  const ref = useRef<ErrorBoundary | null>(null)

  useImperativeHandle(resetRef, () => ({
    reset: () => ref.current?.resetErrorBoundary(),
  }))

  return (
    <ErrorBoundary {...errorBoundaryProps} ref={ref} fallback={rejectedFallback}>
      <Suspense.CSROnly fallback={pendingFallback}>{children}</Suspense.CSROnly>
    </ErrorBoundary>
  )
})

export const AsyncBoundary = BaseAsyncBoundary as typeof BaseAsyncBoundary & {
  CSROnly: typeof CSROnlyAsyncBoundary
}

AsyncBoundary.CSROnly = CSROnlyAsyncBoundary
