import { useMemo, useSyncExternalStore } from 'react'
import { awaitClient } from './AwaitClient'
import type { AwaitOptions, Awaited, Key } from './types'

/**
 * @experimental This is experimental feature.
 */
export const useAwait = <TData, TKey extends Key>(options: AwaitOptions<TData, TKey>): Awaited<TData> => {
  const syncData = () => awaitClient.suspend(options)
  const data = useSyncExternalStore<TData>(
    (sync) => awaitClient.subscribe(options.key, sync).unsubscribe,
    syncData,
    syncData
  )

  return useMemo(
    () => ({
      key: options.key,
      data,
      reset: () => awaitClient.reset(options.key),
    }),
    [data, options.key]
  )
}
