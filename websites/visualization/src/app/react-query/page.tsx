'use client'

import { ErrorBoundary, ErrorBoundaryGroup, QueryErrorBoundary, Suspense, wrap } from '@suspensive/react-query'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { UseSuspenseQuery } from '~/components'
import { Area, Button, RejectedFallback, Spinner } from '~/components/uis'
import { api } from '~/utils/api'

export default wrap.ErrorBoundaryGroup({}).on(function Page() {
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  return (
    <Area title="ErrorBoundaryGroup">
      <div className="text-right">
        <ErrorBoundaryGroup.Consumer>{(group) => <Button onClick={group.reset}>↻</Button>}</ErrorBoundaryGroup.Consumer>
      </div>
      <Area title="QueryErrorResetBoundary + ErrorBoundary + Suspense">
        <ErrorBoundary onReset={queryErrorResetBoundary.reset} fallback={RejectedFallback}>
          <Suspense clientOnly fallback={<Spinner />}>
            <UseSuspenseQuery queryKey={['query', 1] as const} queryFn={() => api.delay(500, { percentage: 40 })} />
            <UseSuspenseQuery queryKey={['query', 2] as const} queryFn={() => api.delay(500, { percentage: 40 })} />
          </Suspense>
        </ErrorBoundary>
      </Area>

      <Area title="QueryErrorBoundary + Suspense">
        <QueryErrorBoundary fallback={RejectedFallback}>
          <Suspense clientOnly fallback={<Spinner />}>
            <UseSuspenseQuery queryKey={['query', 3] as const} queryFn={() => api.delay(500, { percentage: 40 })} />
            <UseSuspenseQuery queryKey={['query', 4] as const} queryFn={() => api.delay(500, { percentage: 40 })} />
          </Suspense>
        </QueryErrorBoundary>
      </Area>
    </Area>
  )
})
