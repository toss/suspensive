import { AsyncBoundary, ErrorBoundary, Suspense, withResetKey } from '@suspensive/react-boundary'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { api } from '../api'
import { ComponentWithUseSuspenseQuery, RejectedFallback } from '../components'
import { Area, Button, DescriptionText, Spinner } from '../components/uis'

const BoundaryExplain = withResetKey(({ reset }) => {
  const { reset: resetQueryError } = useQueryErrorResetBoundary()

  return (
    <Area title="ResetBoundary">
      <Button style={{ alignSelf: 'end' }} onClick={reset}>
        ↻
      </Button>
      <Area title="Suspense (Continuous 3 fetching)">
        <Suspense.CSROnly fallback={<Spinner />}>
          <ComponentWithUseSuspenseQuery queryKey={['boundary', 1]} queryFn={api.alwaysSuccess500} />
          <ComponentWithUseSuspenseQuery queryKey={['boundary', 2]} queryFn={api.alwaysSuccess1000} />
          <ComponentWithUseSuspenseQuery queryKey={['boundary', 3]} queryFn={api.alwaysSuccess1500} />
        </Suspense.CSROnly>
      </Area>

      <DescriptionText>+</DescriptionText>

      <Area title="ErrorBoundary (100% Error)">
        <ErrorBoundary.ResetKey onReset={resetQueryError} fallback={RejectedFallback}>
          <Suspense.CSROnly fallback={<Spinner />}>
            <ComponentWithUseSuspenseQuery queryKey={['boundary', 4]} queryFn={api.alwaysFailure} />
            <ComponentWithUseSuspenseQuery queryKey={['boundary', 5]} queryFn={api.alwaysSuccess500} />
          </Suspense.CSROnly>
        </ErrorBoundary.ResetKey>
      </Area>

      <DescriptionText>=</DescriptionText>

      <Area title="AsyncBoundary (50% Success)">
        <AsyncBoundary.CSROnly.ResetKey
          onReset={resetQueryError}
          pendingFallback={<Spinner />}
          rejectedFallback={RejectedFallback}
        >
          <ComponentWithUseSuspenseQuery queryKey={['boundary', 6]} queryFn={api.alwaysSuccess500} />
          <ComponentWithUseSuspenseQuery queryKey={['boundary', 7]} queryFn={api.halfSuccess} />
        </AsyncBoundary.CSROnly.ResetKey>
      </Area>
    </Area>
  )
})

export default BoundaryExplain
