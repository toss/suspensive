import { ComponentProps, forwardRef } from 'react'
import { AsyncBoundary, ResetRef } from '@suspensive/react-boundary'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

const BaseQueryAsyncBoundary = forwardRef<ResetRef, ComponentProps<typeof AsyncBoundary>>(
  ({ onReset, ...props }, resetRef) => (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <AsyncBoundary
          {...props}
          onReset={() => {
            onReset?.()
            reset()
          }}
          ref={resetRef}
        />
      )}
    </QueryErrorResetBoundary>
  )
)
const CSROnlyQueryAsyncBoundary = forwardRef<ResetRef, ComponentProps<typeof AsyncBoundary.CSROnly>>(
  ({ onReset, ...props }, resetRef) => (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <AsyncBoundary.CSROnly
          {...props}
          onReset={() => {
            onReset?.()
            reset()
          }}
          ref={resetRef}
        />
      )}
    </QueryErrorResetBoundary>
  )
)

export const QueryAsyncBoundary = BaseQueryAsyncBoundary as typeof BaseQueryAsyncBoundary & {
  CSROnly: typeof CSROnlyQueryAsyncBoundary
}
QueryAsyncBoundary.CSROnly = CSROnlyQueryAsyncBoundary
