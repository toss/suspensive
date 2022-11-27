import { ComponentProps, forwardRef, useImperativeHandle, useRef } from 'react'
import { BaseErrorBoundary, ErrorBoundary, ResetRef } from '@suspensive/react-boundary'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

const BaseQueryErrorBoundary = forwardRef<ResetRef, ComponentProps<typeof ErrorBoundary>>(
  ({ onReset, ...props }, resetRef) => {
    const ref = useRef<BaseErrorBoundary>(null)
    useImperativeHandle(resetRef, () => ({
      reset: () => ref.current?.resetErrorBoundary(),
    }))

    return (
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            {...props}
            onReset={() => {
              onReset?.()
              reset()
            }}
            ref={ref}
          />
        )}
      </QueryErrorResetBoundary>
    )
  }
)
const ResetKeyQueryErrorBoundary = forwardRef<ResetRef, ComponentProps<typeof ErrorBoundary.ResetKey>>(
  ({ onReset, ...props }, resetRef) => {
    const ref = useRef<BaseErrorBoundary>(null)
    useImperativeHandle(resetRef, () => ({
      reset: () => ref.current?.resetErrorBoundary(),
    }))

    return (
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary.ResetKey
            {...props}
            onReset={() => {
              onReset?.()
              reset()
            }}
            ref={ref}
          />
        )}
      </QueryErrorResetBoundary>
    )
  }
)

export const QueryErrorBoundary = BaseQueryErrorBoundary as typeof BaseQueryErrorBoundary & {
  ResetKey: typeof ResetKeyQueryErrorBoundary
}
QueryErrorBoundary.ResetKey = ResetKeyQueryErrorBoundary
