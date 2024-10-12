import { ErrorBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react'

/**
 * This component wrapping QueryErrorResetBoundary of `@tanstack/react-query` with `@suspensive/react`'s ErrorBoundary. So you must install `@suspensive/react` first, then use it. with this component, You don't have to make unnecessary repetitive implementation to combine ErrorBoundary with QueryErrorResetBoundary
 * @see {@link https://suspensive.org/en/docs/react-query/QueryErrorBoundary Suspensive Docs}
 * @example
 * ```tsx
 * <QueryErrorBoundary
 *   fallback={({ reset, error }) => <></>)}
 * >
 *   <ChildrenComponent />
 * </QueryErrorBoundary>
 * ```
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
if (process.env.NODE_ENV === 'development') {
  QueryErrorBoundary.displayName = 'QueryErrorBoundary'
}
