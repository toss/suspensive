import { AsyncBoundary, ErrorBoundary, Suspense, withResetBoundary } from '@suspensive/react-boundary'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { api } from '../api'
import { ComponentWithUseSuspenseQuery, RejectedFallback } from '../components'
import { Area, Button, DescriptionText, Spinner } from '../components/uis'

const BoundaryExplain = withResetBoundary(({ resetBoundary, resetBoundaryKey }) => {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <Area title="ResetBoundary">
      <Button style={{ alignSelf: 'end' }} onClick={resetBoundary}>
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
        <ErrorBoundary onReset={reset} resetKeys={[resetBoundaryKey]} fallback={RejectedFallback}>
          <Suspense.CSROnly fallback={<Spinner />}>
            <ComponentWithUseSuspenseQuery queryKey={['boundary', 4]} queryFn={api.alwaysFailure} />
            <ComponentWithUseSuspenseQuery queryKey={['boundary', 5]} queryFn={api.alwaysSuccess500} />
          </Suspense.CSROnly>
        </ErrorBoundary>
      </Area>

      <DescriptionText>=</DescriptionText>

      <Area title="AsyncBoundary (50% Success)">
        <AsyncBoundary.CSROnly
          onReset={reset}
          resetKeys={[resetBoundaryKey]}
          pendingFallback={<Spinner />}
          rejectedFallback={RejectedFallback}
        >
          <ComponentWithUseSuspenseQuery queryKey={['boundary', 6]} queryFn={api.alwaysSuccess500} />
          <ComponentWithUseSuspenseQuery queryKey={['boundary', 7]} queryFn={api.halfSuccess} />
        </AsyncBoundary.CSROnly>
      </Area>
    </Area>
  )
})

export default BoundaryExplain
