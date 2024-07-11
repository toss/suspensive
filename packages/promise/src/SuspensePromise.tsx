import { type FunctionComponent } from 'react'
import type { Key, ResolvedData, SuspensePromiseOptions } from './types'
import { useSuspensePromise } from './useSuspensePromise'

/**
 * @experimental This is experimental feature.
 */
export type SuspensePromiseProps<TData, TKey extends Key> = {
  options: SuspensePromiseOptions<TData, TKey>
  children: FunctionComponent<ResolvedData<TData>>
}

/**
 * @experimental This is experimental feature.
 */
export const SuspensePromise = <TData, TKey extends Key>({
  children: Children,
  options,
}: SuspensePromiseProps<TData, TKey>) => <Children {...useSuspensePromise<TData, TKey>(options)} />
