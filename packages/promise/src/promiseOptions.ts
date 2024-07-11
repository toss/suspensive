import type { Key, SuspensePromiseOptions } from './types'

/**
 * @experimental This is experimental feature.
 */
export const promiseOptions = <TData, TKey extends Key>(options: SuspensePromiseOptions<TData, TKey>) => {
  return options
}
