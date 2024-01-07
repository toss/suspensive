'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { useSuspenseQuery } from '@suspensive/react-query'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Area, Box, Button } from '~/components/uis'
import { api } from '~/utils'

class RootError extends Error {}

export default function Page() {
  const queryError = useQueryErrorResetBoundary()

  return (
    <Area title="Page" className="h-96">
      <ErrorBoundary
        onReset={queryError.reset}
        fallback={(props) => (
          <Box.Error>
            Page: Global: unknown error: {props.error.message}
            <Button onClick={props.reset}>↻</Button>
          </Box.Error>
        )}
      >
        <ErrorBoundary
          catchOn={[AxiosError]}
          onReset={queryError.reset}
          fallback={(props) => (
            <Box.Error>
              Page: AxiosError: Network error: {props.error.message}
              <Button onClick={props.reset}>↻</Button>
            </Box.Error>
          )}
        >
          <Section />
        </ErrorBoundary>
      </ErrorBoundary>
    </Area>
  )
}

const Section = () => {
  const queryError = useQueryErrorResetBoundary()

  return (
    <Area title="Section">
      <ErrorBoundary
        throwOn={[RootError]} // if error is instanceof RootError, parent ErrorBoundary will treat it instead
        onReset={queryError.reset}
        fallback={(props) => (
          <Box.Error>
            Section: {props.error.message}
            <Button onClick={props.reset}>↻</Button>
          </Box.Error>
        )}
      >
        <Suspense clientOnly>
          <AxiosErrorMaker />
        </Suspense>
      </ErrorBoundary>
    </Area>
  )
}

const AxiosErrorMaker = () => {
  useSuspenseQuery({
    queryKey: ['ErrorBoundary', 'throwOn'],
    queryFn: () =>
      api.delay(1000, { percentage: 0 }).catch(() => {
        throw new RootError('error should be catch in root')
      }),
  })

  return <>success</>
}
