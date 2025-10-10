'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { AxiosError, isAxiosError } from 'axios'
import { useState } from 'react'
import { Area, Box, Button } from '~/components/uis'
import { api } from '~/utils'

export default function Page() {
  const queryError = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary
      onReset={queryError.reset}
      fallback={({ error, reset }) => (
        <Box.Error>
          Global: unknown error: {error.message}
          <Button onClick={reset}>↻</Button>
        </Box.Error>
      )}
    >
      <Area title="Page" className="h-96">
        <ErrorBoundary
          shouldCatch={AxiosError} // shouldCatch only AxiosError
          onReset={queryError.reset}
          fallback={({ error, reset }) => (
            <Box.Error>
              Page: AxiosError: Network error: {error.message}
              <Button onClick={reset}>↻</Button>
            </Box.Error>
          )}
        >
          <Area title="Section">
            <ErrorBoundary
              shouldCatch={(error) => !isAxiosError(error)} // shouldCatch if not AxiosError
              onReset={queryError.reset}
              fallback={({ error, reset }) => (
                <Box.Error>
                  Section: {error.message}
                  <Button onClick={reset}>↻</Button>
                </Box.Error>
              )}
            >
              <Suspense clientOnly>
                <AxiosErrorOrJustErrorMaker />
              </Suspense>
            </ErrorBoundary>
          </Area>
        </ErrorBoundary>
      </Area>
    </ErrorBoundary>
  )
}

const AxiosErrorOrJustErrorMaker = () => {
  const [randomNumber] = useState(() => Math.random())
  if (randomNumber > 0.5) {
    throw new Error('sometimes not AxiosError')
  }

  useSuspenseQuery({
    queryKey: ['ErrorBoundary', 'shouldCatch'],
    queryFn: () => api.delay(1000, { percentage: 0 }),
  })

  return <>success</>
}
