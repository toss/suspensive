'use client'

import { ErrorBoundary, ErrorBoundaryGroup, Suspense, withErrorBoundaryGroup } from '@suspensive/react'
import { QueryAsyncBoundary, QueryErrorBoundary } from '@suspensive/react-query'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import Link from 'next/link'
import { RejectedFallback, UseSuspenseQuery } from '~/components'
import { Area, Box, Button, Spinner } from '~/components/uis'
import { api } from '~/utils/api'

const ReactQueryPage = withErrorBoundaryGroup(() => {
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

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
        <ErrorBoundary onReset={queryErrorResetBoundary.reset} fallback={RejectedFallback}>
          <Suspense.CSROnly fallback={<Spinner />}>
            <UseSuspenseQuery queryKey={['query', 1]} queryFn={() => api.delay(500, { percentage: 40 })} />
            <UseSuspenseQuery queryKey={['query', 2]} queryFn={() => api.delay(500, { percentage: 40 })} />
          </Suspense.CSROnly>
        </ErrorBoundary>
      </Area>

      <Area title="QueryErrorBoundary + Suspense">
        <QueryErrorBoundary fallback={RejectedFallback}>
          <Suspense.CSROnly fallback={<Spinner />}>
            <UseSuspenseQuery queryKey={['query', 3]} queryFn={() => api.delay(500, { percentage: 40 })} />
            <UseSuspenseQuery queryKey={['query', 4]} queryFn={() => api.delay(500, { percentage: 40 })} />
          </Suspense.CSROnly>
        </QueryErrorBoundary>
      </Area>

      <Area title="QueryAsyncBoundary">
        <QueryAsyncBoundary.CSROnly pendingFallback={<Spinner />} rejectedFallback={RejectedFallback}>
          <UseSuspenseQuery queryKey={['query', 5]} queryFn={() => api.delay(500, { percentage: 40 })} />
          <UseSuspenseQuery queryKey={['query', 6]} queryFn={() => api.delay(500, { percentage: 40 })} />
        </QueryAsyncBoundary.CSROnly>
      </Area>

      <Area title="Playground">
        <Link href="/react-query/playground" style={{ flex: 1 }}>
          <Box.Default>🔗 @tanstack/react-query vs @suspensive/react-query</Box.Default>
        </Link>
      </Area>
    </Area>
  )
})

export default ReactQueryPage
