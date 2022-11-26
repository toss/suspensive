import { ErrorBoundary, Suspense, withResetKey } from '@suspensive/react-boundary'
import { QueryAsyncBoundary, QueryErrorBoundary } from '@suspensive/react-query'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { api } from '../api'
import { ComponentWithUseSuspenseQuery, RejectedFallback } from '../components'
import { Area, Button, Spinner } from '../components/uis'

const ReactQueryPage = withResetKey(({ reset, resetKey }) => {
  return (
    <Area title="ResetBoundary">
      <Button style={{ alignSelf: 'end' }} onClick={reset}>
        ↻
      </Button>

      <Area title="QueryErrorResetBoundary + ErrorBoundary + Suspense">
        <QueryErrorResetBoundary>
          {({ reset: resetQueryBoundary }) => (
            <ErrorBoundary.ResetKey onReset={resetQueryBoundary} fallback={RejectedFallback}>
              <Suspense.CSROnly fallback={<Spinner />}>
                <ComponentWithUseSuspenseQuery queryKey={['query', 1]} queryFn={api.almostFailure} />
                <ComponentWithUseSuspenseQuery queryKey={['query', 2]} queryFn={api.almostFailure} />
              </Suspense.CSROnly>
            </ErrorBoundary.ResetKey>
          )}
        </QueryErrorResetBoundary>
      </Area>

      <Area title="QueryErrorBoundary + Suspense">
        <QueryErrorBoundary resetKeys={[resetKey]} fallback={RejectedFallback}>
          <Suspense.CSROnly fallback={<Spinner />}>
            <ComponentWithUseSuspenseQuery queryKey={['query', 3]} queryFn={api.almostFailure} />
            <ComponentWithUseSuspenseQuery queryKey={['query', 4]} queryFn={api.almostFailure} />
          </Suspense.CSROnly>
        </QueryErrorBoundary>
      </Area>

      <Area title="QueryAsyncBoundary">
        <QueryAsyncBoundary.CSROnly
          resetKeys={[resetKey]}
          pendingFallback={<Spinner />}
          rejectedFallback={RejectedFallback}
        >
          <ComponentWithUseSuspenseQuery queryKey={['query', 5]} queryFn={api.almostFailure} />
          <ComponentWithUseSuspenseQuery queryKey={['query', 6]} queryFn={api.almostFailure} />
        </QueryAsyncBoundary.CSROnly>
      </Area>
    </Area>
  )
})

export default ReactQueryPage
