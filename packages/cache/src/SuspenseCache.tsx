import { type FunctionComponent } from 'react'
import type { CacheKey, CacheOptions, SuspenseCacheResult } from './types'
import { useSuspenseCache } from './useSuspenseCache'

/**
 * @experimental This is experimental feature.
 */
export type SuspenseCacheProps<TData, TCacheKey extends CacheKey> = {
  cacheKey: CacheOptions<TData, TCacheKey>['cacheKey']
  cacheFn: CacheOptions<TData, TCacheKey>['cacheFn']
  children: FunctionComponent<SuspenseCacheResult<TData>>
}

/**
 * @experimental This is experimental feature.
 */
export const SuspenseCache = <TData, TCacheKey extends CacheKey>({
  children: Children,
  cacheKey,
  cacheFn,
}: SuspenseCacheProps<TData, TCacheKey>) => {
  const options = { cacheKey, cacheFn }

  return <Children {...useSuspenseCache<TData, TCacheKey>(options)} />
}
