'use client'

import { ErrorBoundary, ErrorBoundaryGroup, Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query-5'
import { queryOptions, useQueryErrorResetBoundary } from '@tanstack/react-query'
import { Area, Box, Button, RejectedFallback, Spinner } from '~/components/uis'
import { api } from '~/utils/api'

const delayQuery = (id: number, { ms, percentage }: { ms: number; percentage: number }) =>
  queryOptions({
    queryKey: ['@suspensive/react', 'delayQuery', id] as const,
    queryFn: () => api.delay(ms, { percentage }),
  })

export default function Page() {
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  return (
    <Area title="ErrorBoundaryGroup">
      <ErrorBoundaryGroup>
        <div className="text-right">
          <ErrorBoundaryGroup.Consumer>
            {(group) => <Button onClick={group.reset}>↻</Button>}
          </ErrorBoundaryGroup.Consumer>
        </div>
        <Area title="ErrorBoundaryGroup">
          <ErrorBoundaryGroup>
            <div className="text-right">
              <ErrorBoundaryGroup.Consumer>
                {(group) => <Button onClick={group.reset}>↻</Button>}
              </ErrorBoundaryGroup.Consumer>
            </div>
            <Area title="Suspense (Continuous 3 fetching)">
              <Suspense clientOnly fallback={<Spinner />}>
                <SuspenseQuery {...delayQuery(1, { ms: 500, percentage: 100 })}>
                  {({ data }) => <Box.Success>{data}</Box.Success>}
                </SuspenseQuery>
                <SuspenseQuery {...delayQuery(2, { ms: 1000, percentage: 100 })}>
                  {({ data }) => <Box.Success>{data}</Box.Success>}
                </SuspenseQuery>
                <SuspenseQuery {...delayQuery(3, { ms: 1500, percentage: 100 })}>
                  {({ data }) => <Box.Success>{data}</Box.Success>}
                </SuspenseQuery>
              </Suspense>
            </Area>

            <Area title="ErrorBoundary (100% Error)">
              <ErrorBoundary onReset={queryErrorResetBoundary.reset} fallback={RejectedFallback}>
                <Suspense clientOnly fallback={<Spinner />}>
                  <SuspenseQuery {...delayQuery(4, { ms: 500, percentage: 0 })}>
                    {({ data }) => <Box.Success>{data}</Box.Success>}
                  </SuspenseQuery>
                  <SuspenseQuery {...delayQuery(5, { ms: 500, percentage: 100 })}>
                    {({ data }) => <Box.Success>{data}</Box.Success>}
                  </SuspenseQuery>
                </Suspense>
              </ErrorBoundary>
            </Area>
          </ErrorBoundaryGroup>
        </Area>

        <Area title="ErrorBoundaryGroup blockOutside">
          <ErrorBoundaryGroup blockOutside>
            <div className="text-right">
              <ErrorBoundaryGroup.Consumer>
                {(group) => <Button onClick={group.reset}>↻</Button>}
              </ErrorBoundaryGroup.Consumer>
            </div>
            <Area title="Suspense">
              <Suspense clientOnly fallback={<Spinner />}>
                <SuspenseQuery {...delayQuery(6, { ms: 500, percentage: 100 })}>
                  {({ data }) => <Box.Success>{data}</Box.Success>}
                </SuspenseQuery>
              </Suspense>
            </Area>

            <Area title="ErrorBoundary (100% Error)">
              <ErrorBoundary onReset={queryErrorResetBoundary.reset} fallback={RejectedFallback}>
                <Suspense clientOnly fallback={<Spinner />}>
                  <SuspenseQuery {...delayQuery(7, { ms: 500, percentage: 0 })}>
                    {({ data }) => <Box.Success>{data}</Box.Success>}
                  </SuspenseQuery>
                  <SuspenseQuery {...delayQuery(8, { ms: 500, percentage: 100 })}>
                    {({ data }) => <Box.Success>{data}</Box.Success>}
                  </SuspenseQuery>
                </Suspense>
              </ErrorBoundary>
            </Area>
          </ErrorBoundaryGroup>
        </Area>

        <Area title="ErrorBoundary (100% Error)">
          <ErrorBoundary onReset={queryErrorResetBoundary.reset} fallback={RejectedFallback}>
            <Suspense clientOnly fallback={<Spinner />}>
              <SuspenseQuery {...delayQuery(9, { ms: 500, percentage: 0 })}>
                {({ data }) => <Box.Success>{data}</Box.Success>}
              </SuspenseQuery>
              <SuspenseQuery {...delayQuery(10, { ms: 500, percentage: 100 })}>
                {({ data }) => <Box.Success>{data}</Box.Success>}
              </SuspenseQuery>
            </Suspense>
          </ErrorBoundary>
        </Area>
      </ErrorBoundaryGroup>
    </Area>
  )
}
