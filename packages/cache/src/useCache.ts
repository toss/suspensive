import { useSyncExternalStore } from 'react'
import type { ResolvedCached } from './CacheStore'
import type { CacheKey, CacheOptions } from './types'
import { useCacheStore } from './useCacheStore'

/**
 * @experimental This is experimental feature.
 */
export function useCache<TData, TCacheKey extends CacheKey>(
  options: CacheOptions<TData, TCacheKey>
): ResolvedCached<TData, TCacheKey>['state'] {
  const cacheStore = useCacheStore()
  return useSyncExternalStore<ResolvedCached<TData, TCacheKey>>(
    cacheStore.subscribe,
    () => cacheStore.suspend<TData, TCacheKey>(options),
    () => cacheStore.suspend<TData, TCacheKey>(options)
  ).state
}
