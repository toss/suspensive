'use client'

import { DevMode, ErrorBoundary, Suspense } from '@suspensive/react'
import { Area, Box, Button, Spinner } from '~/components/uis'

DevMode.on() // turn DevMode off
// DevMode.off() // turn DevMode off

export default function Page() {
  return (
    <Area title="DevMode">
      <Area title="<DevMode.Suspense />">
        <Suspense fallback={<Spinner />}>
          <DevMode.Suspense />
          <Box.Success>children</Box.Success>
        </Suspense>
      </Area>
      <Area title="<DevMode.Suspense showFallback />">
        <Suspense fallback={<Spinner />}>
          <DevMode.Suspense showFallback />
          <Box.Success>children</Box.Success>
        </Suspense>
      </Area>

      <Area title="<DevMode.ErrorBoundary />">
        <ErrorBoundary fallback={({ error }) => <Box.Error>{error.message}</Box.Error>}>
          <DevMode.ErrorBoundary />
          <Box.Default>children</Box.Default>
        </ErrorBoundary>
      </Area>
      <Area title="<DevMode.ErrorBoundary showFallback />">
        <ErrorBoundary fallback={({ error }) => <Box.Error>{error.message}</Box.Error>}>
          <DevMode.ErrorBoundary showFallback />
          <Box.Default>children</Box.Default>
        </ErrorBoundary>
      </Area>
      <Area title="<DevMode.ErrorBoundary showFallback after={2000} />">
        <ErrorBoundary fallback={({ error }) => <Box.Error>{error.message}</Box.Error>}>
          <DevMode.ErrorBoundary showFallback after={2000} />
          <Box.Default>children</Box.Default>
        </ErrorBoundary>
      </Area>

      <Area title="DevMode.on/off">
        <div className="flex gap-1">
          <Button onClick={DevMode.on}>on</Button>
          <Button onClick={DevMode.off}>off</Button>
        </div>
        <p className="text-xs text-gray-500">
          These button don't trigger rerender. so you have to go home and then back again this page
        </p>
      </Area>
    </Area>
  )
}
