import type { ResolvedCached } from './Cache'
import type { CacheKey, CacheOptions } from './types'
import { useRead } from './useRead'

/**
 * @experimental This is experimental feature.
 */
export interface ReadProps<TData, TCacheKey extends CacheKey> extends CacheOptions<TData, TCacheKey> {
  children: (props: ResolvedCached<TData, TCacheKey>['state']) => JSX.Element
}

/**
 * @experimental This is experimental feature.
 */
export function Read<TData, TCacheKey extends CacheKey>({ children, ...options }: ReadProps<TData, TCacheKey>) {
  return <>{children(useRead<TData, TCacheKey>(options))}</>
}
