import { type FunctionComponent } from 'react'
import type { CacheOptions, Key, ResolvedData } from './types'
import { useSuspenseCache } from './useSuspenseCache'

/**
 * @experimental This is experimental feature.
 */
export type SuspenseCacheProps<TData, TKey extends Key> = {
  options: CacheOptions<TData, TKey>
  children: FunctionComponent<ResolvedData<TData>>
}

/**
 * @experimental This is experimental feature.
 */
export const SuspenseCache = <TData, TKey extends Key>({
  children: Children,
  options,
}: SuspenseCacheProps<TData, TKey>) => <Children {...useSuspenseCache<TData, TKey>(options)} />
