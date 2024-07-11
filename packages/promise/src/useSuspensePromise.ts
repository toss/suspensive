import { useMemo, useSyncExternalStore } from 'react'
import type { Key, ResolvedData, SuspensePromiseOptions } from './types'
import { usePromiseCache } from './usePromiseCache'

/**
 * @experimental This is experimental feature.
 */
export const useSuspensePromise = <TData, TKey extends Key>(
  options: SuspensePromiseOptions<TData, TKey>
): ResolvedData<TData> => {
  const promiseCache = usePromiseCache()
  const syncData = () => promiseCache.suspend(options)
  const data = useSyncExternalStore<TData>(
    (sync) => promiseCache.subscribe(options.key, sync).unsubscribe,
    syncData,
    syncData
  )

  return useMemo(
    () => ({
      key: options.key,
      data,
      reset: () => promiseCache.reset(options.key),
    }),
    [data, options.key]
  )
}
