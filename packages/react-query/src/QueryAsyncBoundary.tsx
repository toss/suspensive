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

export const QueryAsyncBoundary = BaseQueryAsyncBoundary as typeof BaseQueryAsyncBoundary & {
  CSROnly: typeof CSROnlyQueryAsyncBoundary
}
QueryAsyncBoundary.CSROnly = CSROnlyQueryAsyncBoundary
