import type { Tuple } from './utility-types'

export type Key = Tuple

/**
 * @experimental This is experimental feature.
 */
export type SuspensePromiseOptions<TData, TKey extends Key> = {
  key: TKey
  fn: (options: { key: TKey }) => Promise<TData>
}

export type ResolvedData<TData> = {
  data: TData
  reset: () => void
}
