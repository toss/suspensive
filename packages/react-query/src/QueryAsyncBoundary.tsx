import { ComponentProps, forwardRef } from 'react'
import { AsyncBoundary, ResetRef } from '@suspensive/react-boundary'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'

const BaseQueryAsyncBoundary = forwardRef<ResetRef, ComponentProps<typeof AsyncBoundary>>(
  ({ onReset, ...props }, resetRef) => {
    const { reset } = useQueryErrorResetBoundary()

    return (
      <AsyncBoundary
        {...props}
        onReset={() => {
          reset()
          onReset?.()
        }}
        ref={resetRef}
      />
    )
  }
)
const ResetKeyQueryAsyncBoundary = forwardRef<ResetRef, ComponentProps<typeof AsyncBoundary.ResetKey>>(
  ({ onReset, ...props }, resetRef) => {
    const { reset } = useQueryErrorResetBoundary()

    return (
      <AsyncBoundary.ResetKey
        {...props}
        onReset={() => {
          reset()
          onReset?.()
        }}
        ref={resetRef}
      />
    )
  }
)
const BaseCSROnlyQueryAsyncBoundary = forwardRef<ResetRef, ComponentProps<typeof AsyncBoundary.CSROnly>>(
  ({ onReset, ...props }, resetRef) => {
    const { reset } = useQueryErrorResetBoundary()

    return (
      <AsyncBoundary.CSROnly
        {...props}
        onReset={() => {
          reset()
          onReset?.()
        }}
        ref={resetRef}
      />
    )
  }
)
const ResetKeyCSROnlyQueryAsyncBoundary = forwardRef<ResetRef, ComponentProps<typeof AsyncBoundary.CSROnly.ResetKey>>(
  ({ onReset, ...props }, resetRef) => {
    const { reset } = useQueryErrorResetBoundary()

    return (
      <AsyncBoundary.CSROnly.ResetKey
        {...props}
        onReset={() => {
          reset()
          onReset?.()
        }}
        ref={resetRef}
      />
    )
  }
)

const CSROnlyQueryAsyncBoundary = BaseCSROnlyQueryAsyncBoundary as typeof BaseCSROnlyQueryAsyncBoundary & {
  ResetKey: typeof ResetKeyCSROnlyQueryAsyncBoundary
}
CSROnlyQueryAsyncBoundary.ResetKey = ResetKeyCSROnlyQueryAsyncBoundary
export const QueryAsyncBoundary = BaseQueryAsyncBoundary as typeof BaseQueryAsyncBoundary & {
  CSROnly: typeof CSROnlyQueryAsyncBoundary
  ResetKey: typeof ResetKeyQueryAsyncBoundary
}
QueryAsyncBoundary.CSROnly = CSROnlyQueryAsyncBoundary
QueryAsyncBoundary.ResetKey = ResetKeyQueryAsyncBoundary
