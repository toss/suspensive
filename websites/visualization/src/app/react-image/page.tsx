'use client'

import { wrap } from '@suspensive/react'
import { Image } from '@suspensive/react-image'

export default wrap
  .ErrorBoundary({ fallback: () => <div>error</div> })
  .Suspense.CSROnly({ fallback: 'loading...' })
  .on(function Page() {
    return (
      <div className="flex flex-col">
        <Image src="https://placehold.co/200x100" />
        <Image src="https://placehold.co/200" />
        <Image src="https://placehold.co/200x150/000000/FFFFFF/png" />
        <Image src="https://placehold.co/200x150?text=Hello+World" />
      </div>
    )
  })
