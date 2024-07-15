'use client'

import { Cache, cacheOptions, useCacheStore } from '@suspensive/cache'
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { api } from '~/utils'

const caches = (ms: number) =>
  cacheOptions({
    cacheKey: [ms] as const,
    cacheFn: () => api.delay(ms, { percentage: 100 }),
  })

export default function Page() {
  const cacheStore = useCacheStore()

  return (
    <ErrorBoundary fallback={() => <div>error</div>}>
      <div className="flex flex-col">
        <Suspense clientOnly fallback={<div>loading...</div>}>
          <Cache {...caches(2000)}>
            {(cached) => (
              <div>
                <button
                  onClick={() => {
                    cacheStore.reset(caches(2000))
                  }}
                >
                  Try again
                </button>
                <div>{cached.data}</div>
              </div>
            )}
          </Cache>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
