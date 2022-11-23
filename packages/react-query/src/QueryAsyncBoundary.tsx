import { ComponentProps, forwardRef } from 'react'
import { AsyncBoundary } from '@suspensive/react-boundary'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { ResetRef } from './types'

type Props = Pick<
  ComponentProps<typeof AsyncBoundary>,
  'children' | 'pendingFallback' | 'rejectedFallback' | 'resetKeys' | 'onError' | 'onReset'
>

const BaseQueryAsyncBoundary = forwardRef<ResetRef, Props>(function BaseQueryAsyncBoundary(
  { onReset, ...props },
  resetRef
) {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <AsyncBoundary
      {...props}
      onReset={() => {
        reset()
        onReset?.()
      }}
      ref={resetRef}
    />
  )
})

const CSROnlyQueryAsyncBoundary = forwardRef<ResetRef, Props>(function CSROnlyQueryAsyncBoundary(
  { onReset, children, ...props },
  resetRef
) {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <AsyncBoundary.CSROnly
      {...props}
      onReset={() => {
        reset()
        onReset?.()
      }}
      ref={resetRef}
    >
      {children}
    </AsyncBoundary.CSROnly>
  )
})

export const QueryAsyncBoundary = BaseQueryAsyncBoundary as typeof BaseQueryAsyncBoundary & {
  CSROnly: typeof CSROnlyQueryAsyncBoundary
}

QueryAsyncBoundary.CSROnly = CSROnlyQueryAsyncBoundary
