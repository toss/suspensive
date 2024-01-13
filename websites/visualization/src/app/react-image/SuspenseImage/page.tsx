'use client'

import { wrap } from '@suspensive/react'
import { SuspenseImage } from '@suspensive/react-image'

export default wrap
  .ErrorBoundary({ fallback: () => <div>error</div> })
  .Suspense({ clientOnly: true, fallback: 'loading...' })
  .on(function Page() {
    return (
      <div className="flex flex-col">
        <SuspenseImage src="https://placehold.co/200x100" />
        <SuspenseImage src="https://placehold.co/200" />
        <SuspenseImage src="https://placehold.co/200x150/000000/FFFFFF/png" />
        <SuspenseImage src="https://placehold.co/200x150?text=Hello+World" />
      </div>
    )
  })
