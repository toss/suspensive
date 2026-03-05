'use client'

import { Suspend, Suspense } from '@suspensive/react'
import { useState } from 'react'
import { Area, Box, Spinner } from '~/components/uis'

export default function Page() {
  const [shouldSuspend, setShouldSuspend] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <Area title="Basic Suspend - Indefinitely suspend">
        <Suspense clientOnly fallback={<Spinner />}>
          <Suspend />
          <Box.Success>This text will never be displayed</Box.Success>
        </Suspense>
      </Area>

      <Area title="Conditional Suspend - Toggle with button">
        <div className="mb-2">
          <button
            type="button"
            onClick={() => setShouldSuspend(!shouldSuspend)}
            className="rounded bg-white/60 px-3 py-1 text-xs text-black transition hover:bg-white"
          >
            {shouldSuspend ? 'Disable Suspend' : 'Enable Suspend'}
          </button>
        </div>
        <Suspense clientOnly fallback={<Spinner />}>
          {shouldSuspend && <Suspend />}
          <Box.Success>
            {shouldSuspend ? 'This text will not be displayed (Suspended)' : 'This text will be displayed'}
          </Box.Success>
        </Suspense>
      </Area>

      <Area title="Multiple Suspend - Multiple Suspend components">
        <Suspense clientOnly fallback={<Spinner />}>
          <Box.Default>First box (displayed)</Box.Default>
          <Suspend />
          <Box.Success>Second box (not displayed)</Box.Success>
          <Suspend />
          <Box.Error>Third box (not displayed)</Box.Error>
        </Suspense>
      </Area>

      <Area title="Nested Suspense - Nested Suspense boundaries">
        <Suspense clientOnly fallback={<Box.Default>Outer Fallback</Box.Default>}>
          <Box.Success>Outer Content</Box.Success>
          <Suspense clientOnly fallback={<Box.Default>Inner Fallback</Box.Default>}>
            <Suspend />
            <Box.Error>Inner Content (not displayed)</Box.Error>
          </Suspense>
        </Suspense>
      </Area>

      <Area title="Suspend with Multiple Siblings - With multiple siblings">
        <Suspense clientOnly fallback={<Spinner />}>
          <Box.Default>First sibling (not displayed)</Box.Default>
          <Box.Default>Second sibling (not displayed)</Box.Default>
          <Suspend />
          <Box.Success>Third sibling (not displayed)</Box.Success>
          <Box.Error>Fourth sibling (not displayed)</Box.Error>
        </Suspense>
      </Area>
    </div>
  )
}
