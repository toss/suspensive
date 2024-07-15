import type { CacheKey, CacheOptions } from './types'

/**
 * @experimental This is experimental feature.
 */
export function cacheOptions<TData, TCacheKey extends CacheKey>(
  options: CacheOptions<TData, TCacheKey>
): CacheOptions<TData, TCacheKey> {
  return options
}
