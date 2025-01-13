'use client'

import { ErrorBoundary } from '@suspensive/react'
import { Throw } from '~/components/Throw'

export default function page() {
  return (
    <ErrorBoundary fallback={() => <>root fallback</>}>
      <ErrorBoundary
        shouldCatch={(error) => error.message !== 'children error message'}
        fallback={() => {
          console.log("child ErrorBoundary's fallback")
          return <>child ErrorBoundary's fallback</>
        }}
      >
        <Throw.Error message="children error message" after={2000}>
          before throw Error
        </Throw.Error>
      </ErrorBoundary>
    </ErrorBoundary>
  )
}
