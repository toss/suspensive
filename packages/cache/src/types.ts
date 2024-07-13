import type { Tuple } from './utility-types'

export type Key = Tuple

/**
 * @experimental This is experimental feature.
 */
export type CacheOptions<TData, TKey extends Key> = {
  cacheKey: TKey
  cacheFn: (options: { cacheKey: TKey }) => Promise<TData>
}

export type ResolvedData<TData> = {
  data: TData
  reset: () => void
}
