'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { useSuspenseQuery } from '@suspensive/react-query'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { AxiosError, isAxiosError } from 'axios'
import { Area, Box, Button } from '~/components/uis'
import { api } from '~/utils'

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
          catchOn={[AxiosError, isAxiosError]} // only catch AxiosError or if isAxiosError(error) is true
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

class CustomError extends Error {}

const Section = () => {
  const queryError = useQueryErrorResetBoundary()

  return (
    <Area title="Section">
      <ErrorBoundary
        catchOn={[CustomError]} // only catch CustomError
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
    queryKey: ['ErrorBoundary', 'catchOn'],
    queryFn: () => api.delay(1000, { percentage: 0 }),
  })

  return <>success</>
}
