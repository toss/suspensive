import {
  AsyncBoundary,
  ErrorBoundary,
  Suspense,
  withResetBoundary,
} from '@suspensive/react-boundary'
import { ResetSuspenseQueryBoundary } from '@suspensive/react-query'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ComponentWithUseSuspenseQuery, ErrorAfter1s } from '../components'
import {
  Boundary,
  Box,
  Button,
  DescriptionText,
  ErrorDescription,
  Spacer,
  Spinner,
} from '../components/uis'

const BoundaryExplain = withResetBoundary(({ resetBoundary, resetBoundaryKey }) => {
  return (
    <Boundary.Area>
      <Boundary.Title>ResetBoundary</Boundary.Title>
      <Button style={{ alignSelf: 'end' }} onClick={resetBoundary}>
        ↻
      </Button>
      <Boundary.Area>
        <Boundary.Title>Suspense.CSROnly (100% Success)</Boundary.Title>
        <Suspense.CSROnly fallback={<Spinner />}>
          <ComponentWithUseSuspenseQuery
            queryKey={['async', 'alwaysSuccess']}
            axiosLikeFn={alwaysSuccess}
          />
        </Suspense.CSROnly>
      </Boundary.Area>

      <DescriptionText>+</DescriptionText>

      <Boundary.Area>
        <Boundary.Title>ErrorBoundary (100% Error)</Boundary.Title>
        <ErrorBoundary
          resetKeys={[resetBoundaryKey]}
          fallback={({ error, reset }) => (
            <Box.Error>
              <ErrorDescription>Error: {JSON.stringify(error)}</ErrorDescription>
              <Button onClick={reset}>↻</Button>
            </Box.Error>
          )}
        >
          <ErrorAfter1s />
        </ErrorBoundary>
      </Boundary.Area>

      <DescriptionText>=</DescriptionText>

      <Boundary.Area>
        <Boundary.Title>AsyncBoundary.CSROnly (50% Success)</Boundary.Title>
        <QueryErrorResetBoundary>
          {({ reset: resetQueryBoundary }) => (
            <AsyncBoundary.CSROnly
              onReset={resetQueryBoundary}
              resetKeys={[resetBoundaryKey]}
              pendingFallback={<Spinner />}
              rejectedFallback={({ error, reset }) => (
                <Box.Error>
                  <ErrorDescription>Error: {JSON.stringify(error)}</ErrorDescription>
                  <Button onClick={reset}>↻</Button>
                </Box.Error>
              )}
            >
              <ComponentWithUseSuspenseQuery
                queryKey={['async', 'halfSuccess']}
                axiosLikeFn={halfSuccess}
              />
            </AsyncBoundary.CSROnly>
          )}
        </QueryErrorResetBoundary>
      </Boundary.Area>

      <Spacer />

      <Boundary.Area>
        <Boundary.Title>ResetSuspenseQueryBoundary.CSROnly (20% Success)</Boundary.Title>
        <ResetSuspenseQueryBoundary.CSROnly
          resetKeys={[resetBoundaryKey]}
          pendingFallback={<Spinner />}
          rejectedFallback={({ error, reset }) => (
            <Box.Error>
              <ErrorDescription>Error: {JSON.stringify(error)}</ErrorDescription>
              <Button onClick={reset}>↻</Button>
            </Box.Error>
          )}
        >
          <ComponentWithUseSuspenseQuery
            queryKey={['async', 'almostFailure']}
            axiosLikeFn={almostFailure}
          />
        </ResetSuspenseQueryBoundary.CSROnly>
      </Boundary.Area>
    </Boundary.Area>
  )
})

export default BoundaryExplain

const getAxiosLike =
  (option: { waitMs?: number; successPercentage: number }) => async () => {
    const { waitMs = 1000, successPercentage } = option

    const isSuccess = Math.random() < successPercentage / 100

    await during(waitMs)

    if (!isSuccess) {
      throw { status: 500, message: 'Server Error' }
    }

    return { data: 'Axios Success' }
  }

const alwaysSuccess = getAxiosLike({ successPercentage: 100 })
const halfSuccess = getAxiosLike({ successPercentage: 50 })
const almostFailure = getAxiosLike({ successPercentage: 20 })

const during = async (ms: number) => {
  let start = Date.now()
  let now = start
  while (now - start < ms) {
    now = Date.now()
  }
}
