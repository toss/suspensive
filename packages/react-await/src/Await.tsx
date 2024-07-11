import { type FunctionComponent } from 'react'
import type { AwaitOptions, Awaited, Key } from './types'
import { useAwait } from './useAwait'

/**
 * @experimental This is experimental feature.
 */
export type AwaitProps<TData, TKey extends Key> = {
  options: AwaitOptions<TData, TKey>
  children: FunctionComponent<Awaited<TData>>
}

/**
 * @experimental This is experimental feature.
 */
export const Await = <TData, TKey extends Key>({ children: Children, options }: AwaitProps<TData, TKey>) => (
  <Children {...useAwait<TData, TKey>(options)} />
)
