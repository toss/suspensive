import type { Tuple } from './utility-types'

export type Key = Tuple
export type CacheKey = Key

/**
 * @experimental This is experimental feature.
 */
export type CacheOptions<TData, TCacheKey extends CacheKey> = {
  cacheKey: TCacheKey
  cacheFn: (options: { cacheKey: TCacheKey }) => Promise<TData>
}

export type ResolvedData<TData> = {
  data: TData
  reset: () => void
}
