import type { ResolvedCached } from './Cache'
import type { CacheKey, CacheOptions } from './types'
import { useSuspenseCache } from './useSuspenseCache'

/**
 * @experimental This is experimental feature.
 */
export interface SuspenseCacheProps<TData, TCacheKey extends CacheKey> extends CacheOptions<TData, TCacheKey> {
  children: (props: ResolvedCached<TData, TCacheKey>['state']) => JSX.Element
}

/**
 * @experimental This is experimental feature.
 */
export function SuspenseCache<TData, TCacheKey extends CacheKey>({
  children,
  ...options
}: SuspenseCacheProps<TData, TCacheKey>) {
  return <>{children(useSuspenseCache<TData, TCacheKey>(options))}</>
}
