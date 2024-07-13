import type { CacheOptions, Key } from './types'

/**
 * @experimental This is experimental feature.
 */
export const cacheOptions = <TData, TKey extends Key>(options: CacheOptions<TData, TKey>) => {
  return options
}
