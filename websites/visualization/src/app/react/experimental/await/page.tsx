'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { Await } from '@suspensive/react/experimental'

const delay = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve('resolved')
    }, ms)
  )

const asyncFn = () => delay(4000 * Math.random()).then(() => 'success' as const)

export default function Page() {
  return (
    <ErrorBoundary fallback={() => <>error</>}>
      <Suspense fallback={<>loading...</>}>
        <Await options={{ key: [2000] as const, fn: asyncFn }}>
          {(awaited) => (
            <div>
              <div>{awaited.data}</div>
              <div>{awaited.data}</div>
            </div>
          )}
        </Await>
      </Suspense>
      <Suspense fallback={<>loading...</>}>
        <Await options={{ key: [3000] as const, fn: asyncFn }}>
          {(awaited) => (
            <div>
              <div>{awaited.data}</div>
              <div>{awaited.data}</div>
            </div>
          )}
        </Await>
        <Await options={{ key: [4000] as const, fn: asyncFn }}>
          {(awaited) => (
            <div>
              <div>{awaited.data}</div>
              <div>{awaited.data}</div>
            </div>
          )}
        </Await>
      </Suspense>
    </ErrorBoundary>
  )
}
