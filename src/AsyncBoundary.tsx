import { ComponentProps, ComponentType, forwardRef, Ref, Suspense, useImperativeHandle, useRef } from 'react'
import { SSRSafeSuspense, ErrorBoundary } from '.'

type SuspenseProps = ComponentProps<typeof Suspense>
type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>

type Props = Omit<SuspenseProps, 'fallback'> &
  Omit<ErrorBoundaryProps, 'fallback'> & {
    ssrSafe?: boolean
    pendingFallback: ComponentProps<typeof Suspense>['fallback']
    rejectedFallback: ComponentProps<typeof ErrorBoundary>['fallback']
  }

interface ResetRef {
  reset?(): void
}

const BaseAsyncBoundary = forwardRef(function AsyncBoundary(
  { ssrSafe, pendingFallback, rejectedFallback, children, ...errorBoundaryProps }: Props,
  resetRef: Ref<ResetRef>
) {
  const ref = useRef<ErrorBoundary | null>(null)

  useImperativeHandle(resetRef, () => ({
    reset: () => ref.current?.resetErrorBoundary(),
  }))

  const SelectedSuspense = ssrSafe ? SSRSafeSuspense : Suspense

  return (
    <ErrorBoundary ref={ref} fallback={rejectedFallback} {...errorBoundaryProps}>
      <SelectedSuspense fallback={pendingFallback}>{children}</SelectedSuspense>
    </ErrorBoundary>
  )
})

type SSROrCSRProps = Omit<ComponentProps<typeof AsyncBoundary>, 'ssrSafe'>

type AsyncBoundaryType = typeof BaseAsyncBoundary & {
  SSRSafe: ComponentType<SSROrCSRProps>
  CSROnly: ComponentType<SSROrCSRProps>
}

const AsyncBoundary = BaseAsyncBoundary as AsyncBoundaryType

AsyncBoundary.SSRSafe = forwardRef<ResetRef, SSROrCSRProps>(function SSRSafeAsyncBoundary(props, resetRef) {
  return <AsyncBoundary ssrSafe ref={resetRef} {...props} />
})

AsyncBoundary.CSROnly = forwardRef<ResetRef, SSROrCSRProps>(function CSROnlyAsyncBoundary(props, resetRef) {
  return <AsyncBoundary ref={resetRef} {...props} />
})

export { AsyncBoundary }
