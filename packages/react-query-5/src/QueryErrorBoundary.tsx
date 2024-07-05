import { ErrorBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react'

export const QueryErrorBoundary = forwardRef<
  ComponentRef<typeof ErrorBoundary>,
  ComponentPropsWithoutRef<typeof ErrorBoundary>
>(({ onReset, ...props }, resetRef) => {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <ErrorBoundary
      {...props}
      onReset={() => {
        onReset?.()
        reset()
      }}
      ref={resetRef}
    />
  )
})
if (process.env.NODE_ENV === 'development') {
  QueryErrorBoundary.displayName = 'QueryErrorBoundary'
}
