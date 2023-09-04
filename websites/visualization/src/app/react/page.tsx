'use client'

import { ErrorBoundary, ErrorBoundaryGroup, Suspense } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { RejectedFallback, UseSuspenseQuery } from '~/components'
import { Area, Button, DescriptionText, Spinner } from '~/components/uis'
import { api } from '~/utils/api'

const BoundaryPage = () => {
  const { reset: queryErrorReset } = useQueryErrorResetBoundary()

  return (
    <Area title="ErrorBoundaryGroup">
      <ErrorBoundaryGroup>
        <ErrorBoundaryGroup.Reset
          trigger={({ reset }) => (
            <Button style={{ alignSelf: 'end' }} onClick={reset}>
              ↻
            </Button>
          )}
        />
        <Area title="ErrorBoundaryGroup">
          <ErrorBoundaryGroup>
            <ErrorBoundaryGroup.Reset
              trigger={({ reset }) => (
                <Button style={{ alignSelf: 'end' }} onClick={reset}>
                  ↻
                </Button>
              )}
            />
            <Area title="Suspense (Continuous 3 fetching)">
              <Suspense.CSROnly fallback={<Spinner />}>
                <UseSuspenseQuery queryKey={['react', 1]} queryFn={api.alwaysSuccess500} />
                <UseSuspenseQuery queryKey={['react', 2]} queryFn={api.alwaysSuccess1000} />
                <UseSuspenseQuery queryKey={['react', 3]} queryFn={api.alwaysSuccess1500} />
              </Suspense.CSROnly>
            </Area>

            <DescriptionText>+</DescriptionText>

            <Area title="ErrorBoundary (100% Error)">
              <ErrorBoundary onReset={queryErrorReset} fallback={RejectedFallback}>
                <Suspense.CSROnly fallback={<Spinner />}>
                  <UseSuspenseQuery queryKey={['react', 4]} queryFn={api.alwaysFailure} />
                  <UseSuspenseQuery queryKey={['react', 5]} queryFn={api.alwaysSuccess500} />
                </Suspense.CSROnly>
              </ErrorBoundary>
            </Area>

            <DescriptionText>=</DescriptionText>
          </ErrorBoundaryGroup>
        </Area>

        <Area title="ErrorBoundaryGroup blockOutside">
          <ErrorBoundaryGroup blockOutside>
            <ErrorBoundaryGroup.Reset
              trigger={({ reset }) => (
                <Button style={{ alignSelf: 'end' }} onClick={reset}>
                  ↻
                </Button>
              )}
            />
            <Area title="Suspense">
              <Suspense.CSROnly fallback={<Spinner />}>
                <UseSuspenseQuery queryKey={['react', 1]} queryFn={api.alwaysSuccess500} />
              </Suspense.CSROnly>
            </Area>

            <DescriptionText>+</DescriptionText>

            <Area title="ErrorBoundary (100% Error)">
              <ErrorBoundary onReset={queryErrorReset} fallback={RejectedFallback}>
                <Suspense.CSROnly fallback={<Spinner />}>
                  <UseSuspenseQuery queryKey={['react', 4]} queryFn={api.alwaysFailure} />
                  <UseSuspenseQuery queryKey={['react', 5]} queryFn={api.alwaysSuccess500} />
                </Suspense.CSROnly>
              </ErrorBoundary>
            </Area>
          </ErrorBoundaryGroup>
        </Area>

        <Area title="ErrorBoundary (100% Error)">
          <ErrorBoundary onReset={queryErrorReset} fallback={RejectedFallback}>
            <Suspense.CSROnly fallback={<Spinner />}>
              <UseSuspenseQuery queryKey={['react', 4]} queryFn={api.alwaysFailure} />
              <UseSuspenseQuery queryKey={['react', 5]} queryFn={api.alwaysSuccess500} />
            </Suspense.CSROnly>
          </ErrorBoundary>
        </Area>
      </ErrorBoundaryGroup>
    </Area>
  )
}

export default BoundaryPage
