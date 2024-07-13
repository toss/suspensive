import { useMemo, useSyncExternalStore } from 'react'
import type { CacheKey, CacheOptions, ResolvedData } from './types'
import { useCache } from './useCache'

/**
 * @experimental This is experimental feature.
 */
export const useSuspenseCache = <TData, TCacheKey extends CacheKey>(
  options: CacheOptions<TData, TCacheKey>
): ResolvedData<TData> => {
  const cache = useCache()
  const syncData = () => cache.suspend(options)
  const data = useSyncExternalStore<TData>(
    (sync) => cache.subscribe(options.cacheKey, sync).unsubscribe,
    syncData,
    syncData
  )

  return useMemo(
    () => ({
      promiseKey: options.cacheKey,
      data,
      reset: () => cache.reset(),
    }),
    [data, options.cacheKey, cache]
  )
}
