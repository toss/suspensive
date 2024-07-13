import type { Tuple } from './utility-types'

export type CacheKey = Tuple

/**
 * @experimental This is experimental feature.
 */
export type CacheOptions<TData, TCacheKey extends CacheKey> = {
  cacheKey: TCacheKey
  cacheFn: (options: { cacheKey: TCacheKey }) => Promise<TData>
}

export type SuspenseCacheResult<TData> = {
  data: TData
  reset: () => void
}
