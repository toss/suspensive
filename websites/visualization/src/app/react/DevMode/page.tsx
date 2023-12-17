'use client'

import type { ErrorBoundaryFallbackProps } from '@suspensive/react'
import { DevMode, ErrorBoundary, Suspense, devMode } from '@suspensive/react'
import { Area, Box, Button, Spinner } from '~/components/uis'

export default function Page() {
  return (
    <Area title="devMode">
      <Area title="<Suspense devMode={{ showFallback: true }} />">
        <Suspense fallback={<Spinner />} devMode={{ showFallback: true }}>
          <Box.Success>children</Box.Success>
        </Suspense>
      </Area>

      <Area title="<ErrorBoundary devMode={{ showFallback: true }} />">
        <ErrorBoundary fallback={ErrorBoundaryFallback} devMode={{ showFallback: true }}>
          <Box.Default>children</Box.Default>
        </ErrorBoundary>
      </Area>
      <Area title="<ErrorBoundary devMode={{ showFallback: { after: 2000 } }} />">
        <ErrorBoundary fallback={ErrorBoundaryFallback} devMode={{ showFallback: { after: 2000 } }}>
          <Box.Default>children</Box.Default>
        </ErrorBoundary>
      </Area>

      <Area title="devMode.on/off">
        <div className="flex gap-1">
          <Button onClick={devMode.on}>on</Button>
          <Button onClick={devMode.off}>off</Button>
        </div>
      </Area>

      <DevMode position="topRight" />
    </Area>
  )
}

const ErrorBoundaryFallback = ({ error, reset }: ErrorBoundaryFallbackProps) => (
  <Box.Error>
    {error.message}
    <Button onClick={reset}>↻</Button>
  </Box.Error>
)
