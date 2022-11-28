import { ComponentProps, forwardRef } from 'react'
import { ErrorBoundary, ResetRef } from '@suspensive/react-boundary'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

export const QueryErrorBoundary = forwardRef<ResetRef, ComponentProps<typeof ErrorBoundary>>(
  ({ onReset, ...props }, resetRef) => (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
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
