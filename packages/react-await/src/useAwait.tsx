import { type ReactNode } from 'react'
import type { AwaitState } from './AwaitState'
import { useSyncExternalStore } from './hooks'
import type { AwaitOptions, Key } from './types'
import { useAwaitClient } from './useAwaitClient'

export type AwaitProps<TData, TKey extends Key> = {
  options: AwaitOptions<TData, TKey>
  children: (awaitState: AwaitState<TData, TKey>) => ReactNode
}

/**
 * @experimental This is experimental feature.
 */
export const UseAwait = <TData, TKey extends Key>({ children, options }: AwaitProps<TData, TKey>) =>
  children(useAwait<TData, TKey>(options))

/**
 * @experimental This is experimental feature.
 */
export const useAwait = <TData, TKey extends Key>(options: AwaitOptions<TData, TKey>): AwaitState<TData, TKey> => {
  const awaitClient = useAwaitClient()
  const syncData = () => awaitClient.suspend<TData, TKey>(options)
  return useSyncExternalStore((sync) => awaitClient.subscribe(options.key, sync), syncData, syncData)
}
