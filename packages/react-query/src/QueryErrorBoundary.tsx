import { ComponentProps, forwardRef, useImperativeHandle, useRef } from 'react'
import { ErrorBoundary } from '@suspensive/react-boundary'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ResetRef } from './types'

export const QueryErrorBoundary = forwardRef<ResetRef, ComponentProps<typeof ErrorBoundary>>(
  ({ onReset, ...props }, resetRef) => {
    const ref = useRef<ErrorBoundary>(null)

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
