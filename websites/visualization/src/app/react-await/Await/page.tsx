'use client'

import { Await } from '@suspensive/react-await'
import { ErrorBoundary, Suspense } from '@suspensive/react-query'
import { api } from '~/utils'

export default function Page() {
  return (
    <ErrorBoundary fallback={() => <div>error</div>}>
      <div className="flex flex-col">
        <Suspense clientOnly fallback={<div>loading...</div>}>
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
        </Suspense>
        <Suspense clientOnly fallback={<div>loading...</div>}>
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
        </Suspense>
        <Suspense clientOnly fallback={<div>loading...</div>}>
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
        </Suspense>
        <Suspense clientOnly fallback={<div>loading...</div>}>
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
        </Suspense>
      </div>

      <div className="flex flex-col">
        <Suspense clientOnly fallback={<div>loading...</div>}>
          <Await
            options={{
              key: [3000] as const,
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
        </Suspense>
        <Suspense clientOnly fallback={<div>loading...</div>}>
          <Await
            options={{
              key: [4000] as const,
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
        </Suspense>
        <Suspense clientOnly fallback={<div>loading...</div>}>
          <Await
            options={{
              key: [4000] as const,
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
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
