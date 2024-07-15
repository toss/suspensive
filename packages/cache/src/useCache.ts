import { useSyncExternalStore } from 'react'
import type { ResolvedCached } from './CacheStore'
import type { CacheKey, CacheOptions } from './types'
import { useCacheStore } from './useCacheStore'

/**
 * @experimental This is experimental feature.
 */
export const useCache = <TData, TCacheKey extends CacheKey>(options: CacheOptions<TData, TCacheKey>) => {
  const cacheStore = useCacheStore()
  return useSyncExternalStore<ResolvedCached<TData, TCacheKey>>(
    (sync) => cacheStore.subscribe(options, sync).unsubscribe,
    () => cacheStore.suspend<TData, TCacheKey>(options),
    () => cacheStore.suspend<TData, TCacheKey>(options)
  ).state
}
