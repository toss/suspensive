import { ErrorBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import { forwardRef } from 'react'

/**
 * This component wrapping QueryErrorResetBoundary of @tanstack/react-query with @suspensive/react's ErrorBoundary.
 *
 * So you must install @suspensive/react first, then use it.
 * ```shell
 * npm install @suspensive/react
 * ```
 *
 * ```shell
 * pnpm add @suspensive/react
 * ```
 *
 * ```shell
 * yarn add @suspensive/react
 * ```
 *
 * with this component, You don't have to make unnecessary repetitive implementation to combine ErrorBoundary with QueryErrorResetBoundary
 * @see {@link https://suspensive.org/docs/react-query/QueryErrorBoundary}
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
