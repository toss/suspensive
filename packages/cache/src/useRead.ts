import { useSyncExternalStore } from 'react'
import type { ResolvedCached } from './Cache'
import type { CacheKey, CacheOptions } from './types'
import { useCache } from './useCache'

/**
 * @experimental This is experimental feature.
 */
export function useRead<TData, TCacheKey extends CacheKey>(
  options: CacheOptions<TData, TCacheKey>
): ResolvedCached<TData, TCacheKey>['state'] {
  const cache = useCache()
  return useSyncExternalStore<ResolvedCached<TData, TCacheKey>>(
    cache.subscribe,
    () => cache.suspend<TData, TCacheKey>(options),
    () => cache.suspend<TData, TCacheKey>(options)
  ).state
}
