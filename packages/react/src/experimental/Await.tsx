import { FunctionComponent, useMemo } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'
import { Tuple } from '../types'
import { suspensiveCache } from './suspensiveCache'

type Awaited<TData = unknown> = { data: TData; reset: () => void }
type AwaitOptions<TData, TKey extends Tuple> = {
  key: TKey
  fn: (options: { key: TKey }) => Promise<TData>
}

/**
 * @experimental This is experimental feature.
 */
export const awaitOptions = <TData, TKey extends Tuple>(options: AwaitOptions<TData, TKey>) => options

/**
 * @experimental This is experimental feature.
 */
export const useAwait = <TData, TKey extends Tuple>(options: AwaitOptions<TData, TKey>): Awaited<TData> => {
  const getSnapshot = () => suspensiveCache.suspend(options.key, () => options.fn({ key: options.key }))
  const data = useSyncExternalStore<TData>(
    (onStoreChange) => suspensiveCache.attach(options.key, onStoreChange).detach,
    getSnapshot,
    getSnapshot
  )

  return useMemo(
    () => ({
      data,
      reset: () => suspensiveCache.reset(options.key),
    }),
    [data, options.key]
  )
}

type AwaitProps<TData, TKey extends Tuple> = {
  options: AwaitOptions<TData, TKey>
  children: FunctionComponent<Awaited<TData>>
}

/**
 * @experimental This is experimental feature.
 */
export const Await = <TData, TKey extends Tuple>({ children: Children, options }: AwaitProps<TData, TKey>) => {
  const awaited = useAwait<TData, TKey>(options)
  return <Children {...awaited} />
}
