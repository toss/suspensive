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
          enabled={AxiosError} // enabled only AxiosError
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
              enabled={(error) => !isAxiosError(error)} // enabled if not AxiosError
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
  if (Math.random() > 0.5) {
    throw new Error('sometimes not AxiosError')
  }

  useSuspenseQuery({
    queryKey: ['ErrorBoundary', 'enabled'],
    queryFn: () => api.delay(1000, { percentage: 0 }),
  })

  return <>success</>
}
