import type { CacheKey, CacheOptions } from './types'
import { hashCacheKey } from './utils'

type Sync = (...args: unknown[]) => unknown

type CacheState<TCacheKey extends CacheKey = CacheKey> = {
  promise?: Promise<unknown>
  cacheKey: TCacheKey
  hashedCacheKey: ReturnType<typeof hashCacheKey>
  error?: unknown
  data?: unknown
}

/**
 * @experimental This is experimental feature.
 */
export class Cache {
  private cache = new Map<ReturnType<typeof hashCacheKey>, CacheState>()
  private syncsMap = new Map<ReturnType<typeof hashCacheKey>, Sync[]>()

  public reset = (cacheKey?: CacheKey) => {
    if (cacheKey === undefined || cacheKey.length === 0) {
      this.cache.clear()
      this.syncSubscribers()
      return
    }

    const hashedKey = hashCacheKey(cacheKey)

    if (this.cache.has(hashedKey)) {
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

    const hashedKey = hashCacheKey(cacheKey)
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
    const hashedCacheKey = hashCacheKey(cacheKey)
    const cachedState = this.cache.get(hashedCacheKey)

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
    const newCacheState: CacheState<TCacheKey> = {
      cacheKey,
      hashedCacheKey,
      promise: cacheFn({ cacheKey })
        .then((data) => {
          newCacheState.data = data
        })
        .catch((error: unknown) => {
          newCacheState.error = error
        }),
    }

    this.cache.set(hashedCacheKey, newCacheState)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw newCacheState.promise
  }

  public getData = (cacheKey: CacheKey) => this.cache.get(hashCacheKey(cacheKey))?.data
  public getError = (cacheKey: CacheKey) => this.cache.get(hashCacheKey(cacheKey))?.error

  public subscribe(cacheKey: CacheKey, syncSubscriber: Sync) {
    const hashedKey = hashCacheKey(cacheKey)
    const syncs = this.syncsMap.get(hashedKey)
    this.syncsMap.set(hashedKey, [...(syncs ?? []), syncSubscriber])

    const subscribed = {
      unsubscribe: () => this.unsubscribe(cacheKey, syncSubscriber),
    }
    return subscribed
  }

  public unsubscribe(cacheKey: CacheKey, syncSubscriber: Sync) {
    const hashedKey = hashCacheKey(cacheKey)
    const syncs = this.syncsMap.get(hashedKey)

    if (syncs) {
      this.syncsMap.set(
        hashedKey,
        syncs.filter((sync) => sync !== syncSubscriber)
      )
    }
  }

  private syncSubscribers = (cacheKey?: CacheKey) => {
    const hashedCacheKey = cacheKey ? hashCacheKey(cacheKey) : undefined

    return hashedCacheKey
      ? this.syncsMap.get(hashedCacheKey)?.forEach((sync) => sync())
      : this.syncsMap.forEach((syncs) => syncs.forEach((sync) => sync()))
  }
}
