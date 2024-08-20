'use client'

import { Read, cacheOptions, useCache } from '@suspensive/cache'
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { api } from '~/utils'

const successCache = (ms: number) =>
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
          <Read {...successCache(2000)}>
            {(cached) => (
              <div>
                <button
                  onClick={() => {
                    cache.reset(successCache(2000))
                  }}
                >
                  Try again
                </button>
                <div>{cached.data}</div>
              </div>
            )}
          </Read>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
