import { ErrorBoundary, Suspense, withResetKey } from '@suspensive/react-boundary'
import { QueryAsyncBoundary, QueryErrorBoundary } from '@suspensive/react-query'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { api } from '../api'
import { RejectedFallback, UseSuspenseQuery } from '../components'
import { Area, Button, Spinner } from '../components/uis'

const ReactQueryPage = withResetKey(({ reset }) => {
  return (
    <Area title="ResetKey">
      <Button style={{ alignSelf: 'end' }} onClick={reset}>
        ↻
      </Button>

      <Area title="QueryErrorResetBoundary + ErrorBoundary + Suspense">
        <QueryErrorResetBoundary>
          {({ reset: resetQueryBoundary }) => (
            <ErrorBoundary.ResetKey onReset={resetQueryBoundary} fallback={RejectedFallback}>
              <Suspense.CSROnly fallback={<Spinner />}>
                <UseSuspenseQuery queryKey={['query', 1]} queryFn={api.almostFailure} />
                <UseSuspenseQuery queryKey={['query', 2]} queryFn={api.almostFailure} />
              </Suspense.CSROnly>
            </ErrorBoundary.ResetKey>
          )}
        </QueryErrorResetBoundary>
      </Area>

      <Area title="QueryErrorBoundary + Suspense">
        <QueryErrorBoundary.ResetKey fallback={RejectedFallback}>
          <Suspense.CSROnly fallback={<Spinner />}>
            <UseSuspenseQuery queryKey={['query', 3]} queryFn={api.almostFailure} />
            <UseSuspenseQuery queryKey={['query', 4]} queryFn={api.almostFailure} />
          </Suspense.CSROnly>
        </QueryErrorBoundary.ResetKey>
      </Area>

      <Area title="QueryAsyncBoundary">
        <QueryAsyncBoundary.CSROnly.ResetKey pendingFallback={<Spinner />} rejectedFallback={RejectedFallback}>
          <UseSuspenseQuery queryKey={['query', 5]} queryFn={api.almostFailure} />
          <UseSuspenseQuery queryKey={['query', 6]} queryFn={api.almostFailure} />
        </QueryAsyncBoundary.CSROnly.ResetKey>
      </Area>
    </Area>
  )
})

export default ReactQueryPage
