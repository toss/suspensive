'use client'

import { Stack } from '@jsxcss/emotion'
import SuspenseImage from '@suspensive/image'
import { ErrorBoundary, Suspense } from '@suspensive/react'

export default function Page() {
  return (
    <ErrorBoundary fallback={() => <div>error</div>}>
      <Stack.Vertical>
        <Suspense.CSROnly fallback={<div>loading...</div>}>
          <SuspenseImage src="https://placehold.co/200x100" />
        </Suspense.CSROnly>
        <Suspense.CSROnly fallback={<div>loading...</div>}>
          <SuspenseImage src="https://placehold.co/200" />
        </Suspense.CSROnly>
        <Suspense.CSROnly fallback={<div>loading...</div>}>
          <SuspenseImage src="https://placehold.co/200x150/000000/FFFFFF/png" />
        </Suspense.CSROnly>
        <Suspense.CSROnly fallback={<div>loading...</div>}>
          <SuspenseImage src="https://placehold.co/200x150?text=Hello+World" />
        </Suspense.CSROnly>
      </Stack.Vertical>
    </ErrorBoundary>
  )
}
