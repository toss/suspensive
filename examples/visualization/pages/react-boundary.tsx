import { AsyncBoundary, ErrorBoundary, Suspense, withResetKey } from '@suspensive/react-boundary'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { api } from '../api'
import { RejectedFallback, UseSuspenseQuery } from '../components'
import { Area, Button, DescriptionText, Spinner } from '../components/uis'

const BoundaryExplain = withResetKey(({ reset }) => {
  const { reset: queryErrorReset } = useQueryErrorResetBoundary()

  return (
    <Area title="ResetKey">
      <Button style={{ alignSelf: 'end' }} onClick={reset}>
        ↻
      </Button>
      <Area title="Suspense (Continuous 3 fetching)">
        <Suspense.CSROnly fallback={<Spinner />}>
          <UseSuspenseQuery queryKey={['boundary', 1]} queryFn={api.alwaysSuccess500} />
          <UseSuspenseQuery queryKey={['boundary', 2]} queryFn={api.alwaysSuccess1000} />
          <UseSuspenseQuery queryKey={['boundary', 3]} queryFn={api.alwaysSuccess1500} />
        </Suspense.CSROnly>
      </Area>

      <DescriptionText>+</DescriptionText>

      <Area title="ErrorBoundary (100% Error)">
        <ErrorBoundary.ResetKey onReset={queryErrorReset} fallback={RejectedFallback}>
          <Suspense.CSROnly fallback={<Spinner />}>
            <UseSuspenseQuery queryKey={['boundary', 4]} queryFn={api.alwaysFailure} />
            <UseSuspenseQuery queryKey={['boundary', 5]} queryFn={api.alwaysSuccess500} />
          </Suspense.CSROnly>
        </ErrorBoundary.ResetKey>
      </Area>

      <DescriptionText>=</DescriptionText>

      <Area title="AsyncBoundary (50% Success)">
        <AsyncBoundary.CSROnly.ResetKey
          onReset={queryErrorReset}
          pendingFallback={<Spinner />}
          rejectedFallback={RejectedFallback}
        >
          <UseSuspenseQuery queryKey={['boundary', 6]} queryFn={api.alwaysSuccess500} />
          <UseSuspenseQuery queryKey={['boundary', 7]} queryFn={api.halfSuccess} />
        </AsyncBoundary.CSROnly.ResetKey>
      </Area>
    </Area>
  )
})

export default BoundaryExplain
