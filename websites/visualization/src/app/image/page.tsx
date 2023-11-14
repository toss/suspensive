'use client'

import { Stack } from '@jsxcss/emotion'
import { Image } from '@suspensive/image'
import { wrap } from '@suspensive/react'

export default wrap
  .ErrorBoundary({ fallback: () => <div>error</div> })
  .Suspense.CSROnly({ fallback: 'loading...' })
  .on(function Page() {
    return (
      <Stack.Vertical>
        <Image src="https://placehold.co/200x100" />
        <Image src="https://placehold.co/200" />
        <Image src="https://placehold.co/200x150/000000/FFFFFF/png" />
        <Image src="https://placehold.co/200x150?text=Hello+World" />
      </Stack.Vertical>
    )
  })
