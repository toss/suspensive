import { useSyncExternalStore } from 'react'
import type { ResolvedCached } from './Cache'
import type { CacheKey, CacheOptions } from './types'
import { useCache } from './useCache'

/**
 * @experimental This is experimental feature.
 */
export const useSuspenseCache = <TData, TCacheKey extends CacheKey>(options: CacheOptions<TData, TCacheKey>) => {
  const cache = useCache()
  return useSyncExternalStore<ResolvedCached<TData, TCacheKey>>(
    (sync) => cache.subscribe(options, sync).unsubscribe,
    () => cache.suspend<TData, TCacheKey>(options),
    () => cache.suspend<TData, TCacheKey>(options)
  ).state
}
