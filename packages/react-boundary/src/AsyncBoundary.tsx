import {
  ComponentProps,
  ComponentType,
  forwardRef,
  Ref,
  useImperativeHandle,
  useRef,
} from 'react'
import { Suspense, ErrorBoundary } from '.'

type SuspenseProps = ComponentProps<typeof Suspense>
type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>

type Props = Omit<SuspenseProps, 'fallback'> &
  Omit<ErrorBoundaryProps, 'fallback'> &
  Pick<SuspenseProps, 'ssrSafe'> & {
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

  const SelectedSuspense = ssrSafe ? Suspense.SSRSafe : Suspense.CSROnly

  return (
    <ErrorBoundary ref={ref} fallback={rejectedFallback} {...errorBoundaryProps}>
      <SelectedSuspense fallback={pendingFallback}>{children}</SelectedSuspense>
    </ErrorBoundary>
  )
})

type SSROrCSRAsyncBoundaryProps = Omit<ComponentProps<typeof AsyncBoundary>, 'ssrSafe'>

export const AsyncBoundary = BaseAsyncBoundary as typeof BaseAsyncBoundary & {
  SSRSafe: ComponentType<SSROrCSRAsyncBoundaryProps>
  CSROnly: ComponentType<SSROrCSRAsyncBoundaryProps>
}

AsyncBoundary.SSRSafe = forwardRef<ResetRef, SSROrCSRAsyncBoundaryProps>(
  function SSRSafeAsyncBoundary(props, resetRef) {
    return <AsyncBoundary ssrSafe ref={resetRef} {...props} />
  }
)

AsyncBoundary.CSROnly = forwardRef<ResetRef, SSROrCSRAsyncBoundaryProps>(
  function CSROnlyAsyncBoundary(props, resetRef) {
    return <AsyncBoundary ref={resetRef} {...props} />
  }
)
