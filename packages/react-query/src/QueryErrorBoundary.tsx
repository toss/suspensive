import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'
import { ErrorBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'

/**
 * This component wrapping QueryErrorResetBoundary of @tanstack/react-query with @suspensive/react's ErrorBoundary.
 *
 * with this component, You don't have to make unnecessary repetitive implementation to combine ErrorBoundary with QueryErrorResetBoundary
 * @see {@link https://docs.suspensive.org/docs/react-query/src/QueryErrorResetBoundary.i18n Suspensive Official Docs}
 */
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
if (process.env.NODE_ENV !== 'production') {
  QueryErrorBoundary.displayName = 'QueryErrorBoundary'
}
