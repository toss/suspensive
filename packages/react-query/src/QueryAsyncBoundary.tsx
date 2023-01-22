import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'
import { AsyncBoundary } from '@suspensive/react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

const BaseQueryAsyncBoundary = forwardRef<
  ComponentRef<typeof AsyncBoundary>,
  ComponentPropsWithoutRef<typeof AsyncBoundary>
>(({ onReset, ...props }, resetRef) => (
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
))
const CSROnlyQueryAsyncBoundary = forwardRef<
  ComponentRef<typeof AsyncBoundary>,
  ComponentPropsWithoutRef<typeof AsyncBoundary.CSROnly>
>(({ onReset, ...props }, resetRef) => (
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
))

/**
 * This component wrapping QueryErrorResetBoundary of @tanstack/react-query with @suspensive/react's AsyncBoundary.
 *
 * with this component, You don't have to make unnecessary repetitive implementation to combine AsyncBoundary with QueryErrorResetBoundary
 * @see {@link https://docs.suspensive.org/docs/react-query/src/QueryErrorResetBoundary.i18n Suspensive Official Docs}
 */
export const QueryAsyncBoundary = BaseQueryAsyncBoundary as typeof BaseQueryAsyncBoundary & {
  /**
   * CSROnly mode make QueryAsyncBoundary can be used in SSR framework like Next.js with React 17 or under
   * @see {@link https://docs.suspensive.org/docs/react/src/QueryErrorResetBoundary.i18n Suspensive Official Docs}
   */
  CSROnly: typeof CSROnlyQueryAsyncBoundary
}
QueryAsyncBoundary.CSROnly = CSROnlyQueryAsyncBoundary
