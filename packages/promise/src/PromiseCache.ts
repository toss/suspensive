import type { Key, SuspensePromiseOptions } from './types'
import { hashKey } from './utils'

type Sync = (...args: unknown[]) => unknown

type PromiseCacheState<TKey extends Key = Key> = {
  promise?: Promise<unknown>
  key: TKey
  hashedKey: ReturnType<typeof hashKey>
  error?: unknown
  data?: unknown
}

/**
 * @experimental This is experimental feature.
 */
export class PromiseCache {
  private cache = new Map<ReturnType<typeof hashKey>, PromiseCacheState>()
  private syncsMap = new Map<ReturnType<typeof hashKey>, Sync[]>()

  public reset = (key?: Key) => {
    if (key === undefined || key.length === 0) {
      this.cache.clear()
      this.syncSubscribers()
      return
    }

    const hashedKey = hashKey(key)

    if (this.cache.has(hashedKey)) {
      // TODO: reset with key index hierarchy
      this.cache.delete(hashedKey)
    }

    this.syncSubscribers(key)
  }

  public clearError = (key?: Key) => {
    if (key === undefined || key.length === 0) {
      this.cache.forEach((value, key, map) => {
        map.set(key, { ...value, promise: undefined, error: undefined })
      })
      return
    }

    const hashedKey = hashKey(key)
    const promiseCacheState = this.cache.get(hashedKey)
    if (promiseCacheState) {
      // TODO: clearError with key index hierarchy
      this.cache.set(hashedKey, { ...promiseCacheState, promise: undefined, error: undefined })
    }
  }

  public suspend = <TData, TKey extends Key = Key>({ key, fn }: SuspensePromiseOptions<TData, TKey>): TData => {
    const hashedKey = hashKey(key)
    const promiseCacheState = this.cache.get(hashedKey)

    if (promiseCacheState?.error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw promiseCacheState.error
    }
    if (promiseCacheState?.data) {
      return promiseCacheState.data as TData
    }

    if (promiseCacheState?.promise) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw promiseCacheState.promise
    }

    const newPromiseCache: PromiseCacheState<TKey> = {
      key,
      hashedKey,
      promise: fn({ key })
        .then((data) => {
          newPromiseCache.data = data
        })
        .catch((error: unknown) => {
          newPromiseCache.error = error
        }),
    }

    this.cache.set(hashedKey, newPromiseCache)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw newPromiseCache.promise
  }

  public getData = (key: Key) => this.cache.get(hashKey(key))?.data
  public getError = (key: Key) => this.cache.get(hashKey(key))?.error

  public subscribe(key: Key, syncSubscriber: Sync) {
    const hashedKey = hashKey(key)
    const syncs = this.syncsMap.get(hashedKey)
    this.syncsMap.set(hashedKey, [...(syncs ?? []), syncSubscriber])

    const subscribed = {
      unsubscribe: () => this.unsubscribe(key, syncSubscriber),
    }
    return subscribed
  }

  public unsubscribe(key: Key, syncSubscriber: Sync) {
    const hashedKey = hashKey(key)
    const syncs = this.syncsMap.get(hashedKey)

    if (syncs) {
      this.syncsMap.set(
        hashedKey,
        syncs.filter((sync) => sync !== syncSubscriber)
      )
    }
  }

  private syncSubscribers = (key?: Key) => {
    const hashedKey = key ? hashKey(key) : undefined

    return hashedKey
      ? this.syncsMap.get(hashedKey)?.forEach((sync) => sync())
      : this.syncsMap.forEach((syncs) => syncs.forEach((sync) => sync()))
  }
}
