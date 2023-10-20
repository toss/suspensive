'use client'

import { Stack } from '@jsxcss/emotion'
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { Await } from '@suspensive/react-await'
import { api } from '~/utils'

export default function Page() {
  return (
    <ErrorBoundary fallback={() => <div>error</div>}>
      <Stack.Vertical>
        <Suspense.CSROnly fallback={<div>loading...</div>}>
          <Await
            options={{
              key: [2000] as const,
              fn: ({ key: [ms] }) => api.delay(ms, { percentage: 100 }),
            }}
          >
            {(awaited) => (
              <div>
                <button onClick={awaited.reset}>Try again</button>
                <div>{awaited.data}</div>
              </div>
            )}
          </Await>
        </Suspense.CSROnly>
        <Suspense.CSROnly fallback={<div>loading...</div>}>
          <Await
            options={{
              key: [2000] as const,
              fn: ({ key: [ms] }) => api.delay(ms, { percentage: 100 }),
            }}
          >
            {(awaited) => (
              <div>
                <button onClick={awaited.reset}>Try again</button>
                <div>{awaited.data}</div>
              </div>
            )}
          </Await>
        </Suspense.CSROnly>
        <Suspense.CSROnly fallback={<div>loading...</div>}>
          <Await options={{ key: [2000] as const, fn: ({ key: [ms] }) => api.delay(ms, { percentage: 100 }) }}>
            {(awaited) => (
              <div>
                <button onClick={awaited.reset}>Try again</button>
                <div>{awaited.data}</div>
              </div>
            )}
          </Await>
        </Suspense.CSROnly>
        <Suspense.CSROnly fallback={<div>loading...</div>}>
          <Await
            options={{
              key: [2000] as const,
              fn: ({ key: [ms] }) => api.delay(ms, { percentage: 100 }),
            }}
          >
            {(awaited) => (
              <div>
                <button onClick={awaited.reset}>Try again</button>
                <div>{awaited.data}</div>
              </div>
            )}
          </Await>
        </Suspense.CSROnly>
      </Stack.Vertical>

      <Stack.Vertical>
        <Suspense.CSROnly fallback={<div>loading...</div>}>
          <Await options={{ key: [3000] as const, fn: ({ key: [ms] }) => api.delay(ms, { percentage: 100 }) }}>
            {(awaited) => (
              <div>
                <button onClick={awaited.reset}>Try again</button>
                <div>{awaited.data}</div>
              </div>
            )}
          </Await>
        </Suspense.CSROnly>
        <Suspense.CSROnly fallback={<div>loading...</div>}>
          <Await options={{ key: [4000] as const, fn: ({ key: [ms] }) => api.delay(ms, { percentage: 100 }) }}>
            {(awaited) => (
              <div>
                <button onClick={awaited.reset}>Try again</button>
                <div>{awaited.data}</div>
              </div>
            )}
          </Await>
        </Suspense.CSROnly>
        <Suspense.CSROnly fallback={<div>loading...</div>}>
          <Await options={{ key: [4000] as const, fn: ({ key: [ms] }) => api.delay(ms, { percentage: 100 }) }}>
            {(awaited) => (
              <div>
                <button onClick={awaited.reset}>Try again</button>
                <div>{awaited.data}</div>
              </div>
            )}
          </Await>
        </Suspense.CSROnly>
      </Stack.Vertical>
    </ErrorBoundary>
  )
}
