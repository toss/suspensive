import type { Tuple } from './utility-types'
import type { hashKey } from './utils'

export type Key = Tuple

export type AwaitOptions<TData, TKey extends Key> = {
  key: TKey
  fn: (options: { key: TKey }) => Promise<TData>
  gcTime?: number
}

export type HashedKey = ReturnType<typeof hashKey>
