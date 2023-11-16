import { AsyncBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import { forwardRef } from 'react'

const BaseQueryAsyncBoundary = forwardRef<
  ComponentRef<typeof AsyncBoundary>,
  ComponentPropsWithoutRef<typeof AsyncBoundary>
>(({ onReset, ...props }, resetRef) => {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <AsyncBoundary.CSROnly
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
  BaseQueryAsyncBoundary.displayName = 'QueryAsyncBoundary'
}
const CSROnly = forwardRef<
  ComponentRef<typeof AsyncBoundary.CSROnly>,
  ComponentPropsWithoutRef<typeof AsyncBoundary.CSROnly>
>(({ onReset, ...props }, resetRef) => {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <AsyncBoundary.CSROnly
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
  CSROnly.displayName = 'QueryAsyncBoundary.CSROnly'
}

/**
 * This component wrapping QueryErrorResetBoundary of @tanstack/react-query with @suspensive/react's AsyncBoundary.
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
 * with this component, You don't have to make unnecessary repetitive implementation to combine AsyncBoundary with QueryErrorResetBoundary
 * @see {@link https://suspensive.org/docs/react-query/QueryErrorBoundary}
 */
export const QueryAsyncBoundary = Object.assign(BaseQueryAsyncBoundary, {
  /**
   * CSROnly make QueryAsyncBoundary can be used in SSR framework like Next.js with React 17 or under
   * @see {@link https://suspensive.org/docs/react-query/QueryErrorBoundary}
   */
  CSROnly,
})
