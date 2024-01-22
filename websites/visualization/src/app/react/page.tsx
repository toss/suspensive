'use client'

import { ErrorBoundary, ErrorBoundaryGroup, Suspense } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { UseSuspenseQuery } from '~/components'
import { Area, Button, RejectedFallback, Spinner } from '~/components/uis'
import { api } from '~/utils/api'

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
                <UseSuspenseQuery queryKey={['boundary', 1]} queryFn={() => api.delay(500, { percentage: 100 })} />
                <UseSuspenseQuery queryKey={['boundary', 2]} queryFn={() => api.delay(1000, { percentage: 100 })} />
                <UseSuspenseQuery queryKey={['boundary', 3]} queryFn={() => api.delay(1500, { percentage: 100 })} />
              </Suspense>
            </Area>

            <Area title="ErrorBoundary (100% Error)">
              <ErrorBoundary onReset={queryErrorResetBoundary.reset} fallback={RejectedFallback}>
                <Suspense clientOnly fallback={<Spinner />}>
                  <UseSuspenseQuery queryKey={['boundary', 4]} queryFn={() => api.delay(500, { percentage: 0 })} />
                  <UseSuspenseQuery queryKey={['boundary', 5]} queryFn={() => api.delay(500, { percentage: 100 })} />
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
                <UseSuspenseQuery queryKey={['boundary', 1]} queryFn={() => api.delay(500, { percentage: 100 })} />
              </Suspense>
            </Area>

            <Area title="ErrorBoundary (100% Error)">
              <ErrorBoundary onReset={queryErrorResetBoundary.reset} fallback={RejectedFallback}>
                <Suspense clientOnly fallback={<Spinner />}>
                  <UseSuspenseQuery queryKey={['boundary', 4]} queryFn={() => api.delay(500, { percentage: 0 })} />
                  <UseSuspenseQuery queryKey={['boundary', 5]} queryFn={() => api.delay(500, { percentage: 100 })} />
                </Suspense>
              </ErrorBoundary>
            </Area>
          </ErrorBoundaryGroup>
        </Area>

        <Area title="ErrorBoundary (100% Error)">
          <ErrorBoundary onReset={queryErrorResetBoundary.reset} fallback={RejectedFallback}>
            <Suspense clientOnly fallback={<Spinner />}>
              <UseSuspenseQuery queryKey={['boundary', 4]} queryFn={() => api.delay(500, { percentage: 0 })} />
              <UseSuspenseQuery queryKey={['boundary', 5]} queryFn={() => api.delay(500, { percentage: 100 })} />
            </Suspense>
          </ErrorBoundary>
        </Area>
      </ErrorBoundaryGroup>
    </Area>
  )
}
