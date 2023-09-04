'use client'

import { ErrorBoundary, ErrorBoundaryGroup, Suspense, withErrorBoundaryGroup } from '@suspensive/react'
import { QueryErrorBoundary } from '@suspensive/react-query'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import Link from 'next/link'
import { RejectedFallback, UseSuspenseQuery } from '~/components'
import { Area, Box, Button, Spinner } from '~/components/uis'
import { api } from '~/utils/api'

const ReactQueryPage = withErrorBoundaryGroup(() => (
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
        {(queryErrorResetBoundary) => (
          <ErrorBoundary onReset={queryErrorResetBoundary.reset} fallback={RejectedFallback}>
            <Suspense.CSROnly fallback={<Spinner />}>
              <UseSuspenseQuery queryKey={['react-query', 1]} queryFn={api.almostFailure} />
              <UseSuspenseQuery queryKey={['react-query', 2]} queryFn={api.almostFailure} />
            </Suspense.CSROnly>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Area>

    <Area title="QueryErrorBoundary + Suspense">
      <QueryErrorBoundary fallback={RejectedFallback}>
        <Suspense.CSROnly fallback={<Spinner />}>
          <UseSuspenseQuery queryKey={['react-query', 3]} queryFn={api.almostFailure} />
          <UseSuspenseQuery queryKey={['react-query', 4]} queryFn={api.almostFailure} />
        </Suspense.CSROnly>
      </QueryErrorBoundary>
    </Area>

    <Area title="Playground">
      <Link href="/react-query/playground" style={{ flex: 1 }}>
        <Box.Default>🔗 @tanstack/react-query vs @suspensive/react-query</Box.Default>
      </Link>
    </Area>
  </Area>
))

export default ReactQueryPage
