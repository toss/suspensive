import type { Tuple } from './utility-types'

export type Sync = (...args: unknown[]) => unknown

export type CacheKey = Tuple

/**
 * @experimental This is experimental feature.
 */
export interface CacheOptions<TData, TCacheKey extends CacheKey> {
  cacheKey: TCacheKey
  cacheFn: (options: { cacheKey: TCacheKey }) => Promise<TData>
}

export declare const dataTagSymbol: unique symbol
export type DataTag<TType, TValue> = TType & {
  [dataTagSymbol]: TValue
}
