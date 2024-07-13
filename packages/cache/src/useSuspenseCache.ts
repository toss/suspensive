import { useMemo, useSyncExternalStore } from 'react'
import type { CacheOptions, Key, ResolvedData } from './types'
import { useCache } from './useCache'

/**
 * @experimental This is experimental feature.
 */
export const useSuspenseCache = <TData, TKey extends Key>(options: CacheOptions<TData, TKey>): ResolvedData<TData> => {
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
