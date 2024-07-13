import type { CacheKey, CacheOptions } from './types'
import { hashKey } from './utils'

type Sync = (...args: unknown[]) => unknown

type CacheState<TCacheKey extends CacheKey = CacheKey> = {
  promise?: Promise<unknown>
  cacheKey: TCacheKey
  hashedKey: ReturnType<typeof hashKey>
  error?: unknown
  data?: unknown
}

/**
 * @experimental This is experimental feature.
 */
export class Cache {
  private cache = new Map<ReturnType<typeof hashKey>, CacheState>()
  private syncsMap = new Map<ReturnType<typeof hashKey>, Sync[]>()

  public reset = (cacheKey?: CacheKey) => {
    if (cacheKey === undefined || cacheKey.length === 0) {
      this.cache.clear()
      this.syncSubscribers()
      return
    }

    const hashedKey = hashKey(cacheKey)

    if (this.cache.has(hashedKey)) {
      // TODO: reset with key index hierarchy
      this.cache.delete(hashedKey)
    }

    this.syncSubscribers(cacheKey)
  }

  public clearError = (cacheKey?: CacheKey) => {
    if (cacheKey === undefined || cacheKey.length === 0) {
      this.cache.forEach((value, key, map) => {
        map.set(key, { ...value, promise: undefined, error: undefined })
      })
      return
    }

    const hashedKey = hashKey(cacheKey)
    const cachedState = this.cache.get(hashedKey)
    if (cachedState) {
      // TODO: clearError with key index hierarchy
      this.cache.set(hashedKey, { ...cachedState, promise: undefined, error: undefined })
    }
  }

  public suspend = <TData, TCacheKey extends CacheKey = CacheKey>({
    cacheKey,
    cacheFn,
  }: CacheOptions<TData, TCacheKey>): TData => {
    const hashedKey = hashKey(cacheKey)
    const cachedState = this.cache.get(hashedKey)

    if (cachedState) {
      if (cachedState.error) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw cachedState.error
      }
      if (cachedState.data) {
        return cachedState.data as TData
      }

      if (cachedState.promise) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw cachedState.promise
      }
    }
    const newCache: CacheState<TCacheKey> = {
      cacheKey,
      hashedKey,
      promise: cacheFn({ cacheKey })
        .then((data) => {
          newCache.data = data
        })
        .catch((error: unknown) => {
          newCache.error = error
        }),
    }

    this.cache.set(hashedKey, newCache)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw newCache.promise
  }

  public getData = (cacheKey: CacheKey) => this.cache.get(hashKey(cacheKey))?.data
  public getError = (cacheKey: CacheKey) => this.cache.get(hashKey(cacheKey))?.error

  public subscribe(cacheKey: CacheKey, syncSubscriber: Sync) {
    const hashedKey = hashKey(cacheKey)
    const syncs = this.syncsMap.get(hashedKey)
    this.syncsMap.set(hashedKey, [...(syncs ?? []), syncSubscriber])

    const subscribed = {
      unsubscribe: () => this.unsubscribe(cacheKey, syncSubscriber),
    }
    return subscribed
  }

  public unsubscribe(cacheKey: CacheKey, syncSubscriber: Sync) {
    const hashedKey = hashKey(cacheKey)
    const syncs = this.syncsMap.get(hashedKey)

    if (syncs) {
      this.syncsMap.set(
        hashedKey,
        syncs.filter((sync) => sync !== syncSubscriber)
      )
    }
  }

  private syncSubscribers = (cacheKey?: CacheKey) => {
    const hashedKey = cacheKey ? hashKey(cacheKey) : undefined

    return hashedKey
      ? this.syncsMap.get(hashedKey)?.forEach((sync) => sync())
      : this.syncsMap.forEach((syncs) => syncs.forEach((sync) => sync()))
  }
}
