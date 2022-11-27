import { ComponentProps, forwardRef } from 'react'
import { AsyncBoundary } from '@suspensive/react-boundary'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { ResetRef } from './types'

type Props = Pick<
  ComponentProps<typeof AsyncBoundary>,
  'children' | 'pendingFallback' | 'rejectedFallback' | 'resetKeys' | 'onError' | 'onReset' | 'ref' | 'key'
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
const ResetKeyQueryAsyncBoundary = forwardRef<ResetRef, Props>(function ResetKeyQueryAsyncBoundary(
  { onReset, ...props },
  resetRef
) {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <AsyncBoundary.ResetKey
      {...props}
      onReset={() => {
        reset()
        onReset?.()
      }}
      ref={resetRef}
    />
  )
})
const BaseCSROnlyQueryAsyncBoundary = forwardRef<ResetRef, Props>(function BaseCSROnlyQueryAsyncBoundary(
  { onReset, ...props },
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
    />
  )
})
const ResetKeyCSROnlyQueryAsyncBoundary = forwardRef<ResetRef, Props>(function ResetKeyCSROnlyQueryAsyncBoundary(
  { onReset, ...props },
  resetRef
) {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <AsyncBoundary.CSROnly.ResetKey
      {...props}
      onReset={() => {
        reset()
        onReset?.()
      }}
      ref={resetRef}
    />
  )
})

const CSROnlyQueryAsyncBoundary = BaseCSROnlyQueryAsyncBoundary as typeof BaseCSROnlyQueryAsyncBoundary & {
  ResetKey: typeof ResetKeyCSROnlyQueryAsyncBoundary
}
CSROnlyQueryAsyncBoundary.ResetKey = ResetKeyCSROnlyQueryAsyncBoundary
export const QueryAsyncBoundary = BaseQueryAsyncBoundary as typeof BaseQueryAsyncBoundary & {
  CSROnly: typeof CSROnlyQueryAsyncBoundary
  ResetKey: typeof ResetKeyQueryAsyncBoundary
}
QueryAsyncBoundary.CSROnly = CSROnlyQueryAsyncBoundary
QueryAsyncBoundary.ResetKey = ResetKeyQueryAsyncBoundary
