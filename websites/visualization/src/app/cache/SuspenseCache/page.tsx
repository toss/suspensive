'use client'

import { SuspenseCache, cacheOptions, useCache } from '@suspensive/cache'
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { api } from '~/utils'

const caches = (ms: number) =>
  cacheOptions({
    cacheKey: [ms] as const,
    cacheFn: () => api.delay(ms, { percentage: 100 }),
  })

export default function Page() {
  const cache = useCache()

  return (
    <ErrorBoundary fallback={() => <div>error</div>}>
      <div className="flex flex-col">
        <Suspense clientOnly fallback={<div>loading...</div>}>
          <SuspenseCache {...caches(2000)}>
            {(cached) => (
              <div>
                <button
                  onClick={() => {
                    cache.reset(caches(2000))
                  }}
                >
                  Try again
                </button>
                <div>{cached.data}</div>
              </div>
            )}
          </SuspenseCache>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
