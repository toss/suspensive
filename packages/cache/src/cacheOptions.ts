import type { CacheKey, CacheOptions } from './types'

/**
 * @experimental This is experimental feature.
 */
export const cacheOptions = <TData, TCacheKey extends CacheKey>(options: CacheOptions<TData, TCacheKey>) => {
  return options
}
