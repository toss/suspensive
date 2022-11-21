import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ComponentProps, forwardRef } from 'react'
import { AsyncBoundary } from '@suspensive/react-boundary'

type Props = Pick<
  ComponentProps<typeof AsyncBoundary>,
  'children' | 'pendingFallback' | 'rejectedFallback' | 'resetKeys'
>

interface ResetRef {
  reset?(): void
}

const BaseResetSuspenseQueryBoundary = forwardRef<ResetRef, Props>(
  function BaseResetSuspenseQueryBoundary(props, resetRef) {
    return (
      <QueryErrorResetBoundary>
        {({ reset }) => <AsyncBoundary ref={resetRef} {...props} onReset={reset} />}
      </QueryErrorResetBoundary>
    )
  }
)

const CSROnlyResetSuspenseQueryBoundary = forwardRef<ResetRef, Props>(
  function BaseResetSuspenseQueryBoundary(props, resetRef) {
    return (
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <AsyncBoundary.CSROnly ref={resetRef} {...props} onReset={reset} />
        )}
      </QueryErrorResetBoundary>
    )
  }
)

export const ResetSuspenseQueryBoundary =
  BaseResetSuspenseQueryBoundary as typeof BaseResetSuspenseQueryBoundary & {
    CSROnly: typeof CSROnlyResetSuspenseQueryBoundary
  }

ResetSuspenseQueryBoundary.CSROnly = CSROnlyResetSuspenseQueryBoundary
