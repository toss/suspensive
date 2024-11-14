'use client'

import { ErrorBoundary, ErrorBoundaryGroup, Suspense, wrap } from '@suspensive/react'
import { SuspenseQuery, queryOptions } from '@suspensive/react-query'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Area, Box, Button, RejectedFallback, Spinner } from '~/components/uis'
import { api } from '~/utils/api'

const delayQuery = (id: number, { ms, percentage }: { ms: number; percentage: number }) =>
  queryOptions({
    queryKey: ['@suspensive/react-query', 'delayQuery', id] as const,
    queryFn: () => api.delay(ms, { percentage }),
  })

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
            <SuspenseQuery {...delayQuery(1, { ms: 500, percentage: 40 })}>
              {({ data }) => <Box.Success>{data}</Box.Success>}
            </SuspenseQuery>
            <SuspenseQuery {...delayQuery(2, { ms: 500, percentage: 40 })}>
              {({ data }) => <Box.Success>{data}</Box.Success>}
            </SuspenseQuery>
          </Suspense>
        </ErrorBoundary>
      </Area>
    </Area>
  )
})
