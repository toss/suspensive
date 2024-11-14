import { ErrorBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react'

/**
 * This component wrapping QueryErrorResetBoundary of `@tanstack/react-query` with `@suspensive/react`'s ErrorBoundary. So you must install `@suspensive/react` first, then use it. with this component, You don't have to make unnecessary repetitive implementation to combine ErrorBoundary with QueryErrorResetBoundary
 * @deprecated this interface will be removed in the next major version. Please make this component yourself by combining ErrorBoundary of `@suspensive/react` and useQueryErrorResetBoundary of `@tanstack/react-query`
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
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  QueryErrorBoundary.displayName = 'QueryErrorBoundary'
}
