import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ComponentProps, forwardRef, Ref } from 'react'
import { AsyncBoundary } from '@suspensive/boundary'

type Props = Pick<
  ComponentProps<typeof AsyncBoundary>,
  'children' | 'pendingFallback' | 'rejectedFallback' | 'resetKeys' | 'ssrSafe'
>

interface ResetRef {
  reset?(): void
}

const BaseResetSuspenseQueryBoundary = forwardRef(function BaseResetSuspenseQueryBoundary(
  props: Props,
  resetRef: Ref<ResetRef>
) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => <AsyncBoundary ref={resetRef} {...props} onReset={reset} />}
    </QueryErrorResetBoundary>
  )
})

type ResetSuspenseQueryBoundaryType = typeof BaseResetSuspenseQueryBoundary & {
  SSRSafe: typeof BaseResetSuspenseQueryBoundary
  CSRSafe: typeof BaseResetSuspenseQueryBoundary
}

const ResetSuspenseQueryBoundary =
  BaseResetSuspenseQueryBoundary as ResetSuspenseQueryBoundaryType

type SSROrCSRProps = Omit<
  ComponentProps<typeof BaseResetSuspenseQueryBoundary>,
  'ssrSafe'
>

ResetSuspenseQueryBoundary.SSRSafe = forwardRef<ResetRef, SSROrCSRProps>(
  function SSRSafeResetSuspenseQueryBoundary(props, resetRef) {
    return <BaseResetSuspenseQueryBoundary ssrSafe ref={resetRef} {...props} />
  }
)

ResetSuspenseQueryBoundary.CSRSafe = forwardRef<ResetRef, SSROrCSRProps>(
  function SSRSafeResetSuspenseQueryBoundary(props, resetRef) {
    return <BaseResetSuspenseQueryBoundary ref={resetRef} {...props} />
  }
)

export default ResetSuspenseQueryBoundary
