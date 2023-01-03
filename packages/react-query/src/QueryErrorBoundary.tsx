import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'
import { ErrorBoundary } from '@suspensive/react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

export const QueryErrorBoundary = forwardRef<
  ComponentRef<typeof ErrorBoundary>,
  ComponentPropsWithoutRef<typeof ErrorBoundary>
>(({ onReset, ...props }, resetRef) => (
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
))
