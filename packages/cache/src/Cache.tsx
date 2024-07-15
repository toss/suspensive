import type { ResolvedCached } from './CacheStore'
import type { CacheKey, CacheOptions } from './types'
import { useCache } from './useCache'

/**
 * @experimental This is experimental feature.
 */
export interface CacheProps<TData, TCacheKey extends CacheKey> extends CacheOptions<TData, TCacheKey> {
  children: (props: ResolvedCached<TData, TCacheKey>['state']) => JSX.Element
}

/**
 * @experimental This is experimental feature.
 */
export function Cache<TData, TCacheKey extends CacheKey>({ children, ...options }: CacheProps<TData, TCacheKey>) {
  return <>{children(useCache<TData, TCacheKey>(options))}</>
}
