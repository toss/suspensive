import { ComponentProps, forwardRef, useImperativeHandle, useRef } from 'react'
import { BaseErrorBoundary } from './ErrorBoundary'
import { useResetKey } from './ResetKey'
import { ResetRef } from './types'
import { ErrorBoundary, Suspense } from '.'

type SuspenseProps = ComponentProps<typeof Suspense>
type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>

interface Props extends Omit<SuspenseProps, 'fallback'>, Omit<ErrorBoundaryProps, 'fallback'> {
  pendingFallback: SuspenseProps['fallback']
  rejectedFallback: ErrorBoundaryProps['fallback']
}

const BaseAsyncBoundary = forwardRef<ResetRef, Props>(function BaseAsyncBoundary(
  { pendingFallback, rejectedFallback, children, ...errorBoundaryProps },
  resetRef
) {
  const ref = useRef<BaseErrorBoundary | null>(null)

  useImperativeHandle(resetRef, () => ({
    reset: () => ref.current?.resetErrorBoundary(),
  }))

  return (
    <ErrorBoundary {...errorBoundaryProps} ref={ref} fallback={rejectedFallback}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
})

const BaseCSROnlyAsyncBoundary = forwardRef<ResetRef, Props>(function CSROnlyAsyncBoundary(
  { pendingFallback, rejectedFallback, children, ...errorBoundaryProps },
  resetRef
) {
  const ref = useRef<BaseErrorBoundary | null>(null)

  useImperativeHandle(resetRef, () => ({
    reset: () => ref.current?.resetErrorBoundary(),
  }))

  return (
    <ErrorBoundary {...errorBoundaryProps} ref={ref} fallback={rejectedFallback}>
      <Suspense.CSROnly fallback={pendingFallback}>{children}</Suspense.CSROnly>
    </ErrorBoundary>
  )
})

const ResetKeyCSROnlyAsyncBoundary = forwardRef<ResetRef, Props>(function ResetKeyCSROnlyAsyncBoundary(
  { pendingFallback, rejectedFallback, children, resetKeys, ...errorBoundaryProps },
  resetRef
) {
  const { resetKey } = useResetKey()
  const ref = useRef<BaseErrorBoundary | null>(null)
  useImperativeHandle(resetRef, () => ({ reset: () => ref.current?.resetErrorBoundary() }))

  return (
    <ErrorBoundary
      {...errorBoundaryProps}
      resetKeys={[resetKey, ...(resetKeys || [])]}
      ref={ref}
      fallback={rejectedFallback}
    >
      <Suspense.CSROnly fallback={pendingFallback}>{children}</Suspense.CSROnly>
    </ErrorBoundary>
  )
})

const ResetKeyAsyncBoundary = forwardRef<ResetRef, Props>(function ResetKeyAsyncBoundary(
  { pendingFallback, rejectedFallback, children, resetKeys, ...errorBoundaryProps },
  resetRef
) {
  const { resetKey } = useResetKey()
  const ref = useRef<BaseErrorBoundary | null>(null)
  useImperativeHandle(resetRef, () => ({ reset: () => ref.current?.resetErrorBoundary() }))

  return (
    <ErrorBoundary
      {...errorBoundaryProps}
      resetKeys={[resetKey, ...(resetKeys || [])]}
      ref={ref}
      fallback={rejectedFallback}
    >
      <Suspense.CSROnly fallback={pendingFallback}>{children}</Suspense.CSROnly>
    </ErrorBoundary>
  )
})

const CSROnlyAsyncBoundary = BaseCSROnlyAsyncBoundary as typeof BaseCSROnlyAsyncBoundary & {
  ResetKey: typeof ResetKeyCSROnlyAsyncBoundary
}
CSROnlyAsyncBoundary.ResetKey = ResetKeyCSROnlyAsyncBoundary

export const AsyncBoundary = BaseAsyncBoundary as typeof BaseAsyncBoundary & {
  CSROnly: typeof CSROnlyAsyncBoundary
  ResetKey: typeof ResetKeyAsyncBoundary
}
AsyncBoundary.CSROnly = CSROnlyAsyncBoundary
AsyncBoundary.ResetKey = ResetKeyAsyncBoundary
