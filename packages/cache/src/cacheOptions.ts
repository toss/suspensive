import type { CacheKey, CacheOptions, DataTag } from './types'

/**
 * @experimental This is experimental feature.
 */
export function cacheOptions<TData, TCacheKey extends CacheKey>(
  options: CacheOptions<TData, TCacheKey>
): CacheOptions<TData, TCacheKey> & {
  cacheKey: DataTag<TCacheKey, TData>
}

/**
 * @experimental This is experimental feature.
 */
export function cacheOptions(options: unknown) {
  return options
}
