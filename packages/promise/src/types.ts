import type { Tuple } from './utility-types'

export type Key = Tuple

/**
 * @experimental This is experimental feature.
 */
export type SuspensePromiseOptions<TData, TKey extends Key> = {
  promiseKey: TKey
  promiseFn: (options: { promiseKey: TKey }) => Promise<TData>
}

export type ResolvedData<TData> = {
  data: TData
  reset: () => void
}
