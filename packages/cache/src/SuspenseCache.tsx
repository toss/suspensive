import { type FunctionComponent } from 'react'
import type { CacheKey, CacheOptions, ResolvedData } from './types'
import { useSuspenseCache } from './useSuspenseCache'

/**
 * @experimental This is experimental feature.
 */
export type SuspenseCacheProps<TData, TCacheKey extends CacheKey> = {
  options: CacheOptions<TData, TCacheKey>
  children: FunctionComponent<ResolvedData<TData>>
}

/**
 * @experimental This is experimental feature.
 */
export const SuspenseCache = <TData, TCacheKey extends CacheKey>({
  children: Children,
  options,
}: SuspenseCacheProps<TData, TCacheKey>) => <Children {...useSuspenseCache<TData, TCacheKey>(options)} />
