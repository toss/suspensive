import { ErrorBoundary, ErrorBoundaryGroup, Suspense, withErrorBoundaryGroup } from '@suspensive/react'
import { QueryAsyncBoundary, QueryErrorBoundary } from '@suspensive/react-query'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import Link from 'next/link'
import { api } from '../../api'
import { RejectedFallback, UseSuspenseQuery } from '../../components'
import { Area, Box, Button, Spinner } from '../../components/uis'

const ReactQueryPage = withErrorBoundaryGroup(() => {
  return (
    <Area title="ErrorBoundaryGroup">
      <ErrorBoundaryGroup.Reset
        trigger={({ reset }) => (
          <Button style={{ alignSelf: 'end' }} onClick={reset}>
            ↻
          </Button>
        )}
      />
      <Area title="QueryErrorResetBoundary + ErrorBoundary + Suspense">
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset} fallback={RejectedFallback}>
              <Suspense.CSROnly fallback={<Spinner />}>
                <UseSuspenseQuery queryKey={['query', 1]} queryFn={api.almostFailure} />
                <UseSuspenseQuery queryKey={['query', 2]} queryFn={api.almostFailure} />
              </Suspense.CSROnly>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Area>

      <Area title="QueryErrorBoundary + Suspense">
        <QueryErrorBoundary fallback={RejectedFallback}>
          <Suspense.CSROnly fallback={<Spinner />}>
            <UseSuspenseQuery queryKey={['query', 3]} queryFn={api.almostFailure} />
            <UseSuspenseQuery queryKey={['query', 4]} queryFn={api.almostFailure} />
          </Suspense.CSROnly>
        </QueryErrorBoundary>
      </Area>

      <Area title="QueryAsyncBoundary">
        <QueryAsyncBoundary.CSROnly pendingFallback={<Spinner />} rejectedFallback={RejectedFallback}>
          <UseSuspenseQuery queryKey={['query', 5]} queryFn={api.almostFailure} />
          <UseSuspenseQuery queryKey={['query', 6]} queryFn={api.almostFailure} />
        </QueryAsyncBoundary.CSROnly>
      </Area>

      <Area title="Playground">
        <Link href={'/react-query/playground'} style={{ flex: 1 }}>
          <Box.Default>🔗 @tanstack/react-query vs @suspensive/react-query</Box.Default>
        </Link>
      </Area>
    </Area>
  )
})

export default ReactQueryPage
