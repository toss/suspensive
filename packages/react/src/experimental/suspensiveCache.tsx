import { Tuple } from '../types'

type Cache<TKey extends Tuple = Tuple> = {
  promise?: Promise<unknown>
  key: TKey
  error?: unknown
  data?: unknown
}

class SuspensiveCacheObserver {
  private cache = new Map<string, Cache>()

  public reset = <TKey extends Tuple>(key?: TKey) => {
    if (key === undefined || key.length === 0) {
      this.cache.clear()
      this.notifyToAttacher()
      return
    }

    const stringifiedKey = JSON.stringify(key)

    if (this.cache.has(stringifiedKey)) {
      // TODO: reset with key index hierarchy
      this.cache.delete(stringifiedKey)
    }

    this.notifyToAttacher(stringifiedKey)
  }

  public clearError = <TKey extends Tuple>(key?: TKey) => {
    if (key === undefined || key.length === 0) {
      this.cache.forEach((value, key, map) => {
        map.set(key, { ...value, promise: undefined, error: undefined })
      })
      return
    }

    const stringifiedKey = JSON.stringify(key)
    const cacheGot = this.cache.get(stringifiedKey)
    if (cacheGot) {
      // TODO: clearError with key index hierarchy
      this.cache.set(stringifiedKey, { ...cacheGot, promise: undefined, error: undefined })
    }
  }

  public suspend = <TKey extends Tuple, TData>(key: TKey, fn: (options: { key: TKey }) => Promise<TData>): TData => {
    const stringifiedKey = JSON.stringify(key)
    const cacheGot = this.cache.get(stringifiedKey)

    if (cacheGot?.error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw cacheGot.error
    }
    if (cacheGot?.data) {
      return cacheGot.data as TData
    }

    if (cacheGot?.promise) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw cacheGot.promise
    }

    const newCache: Cache<TKey> = {
      key,
      promise: fn({ key })
        .then((data) => {
          newCache.data = data
        })
        .catch((error) => {
          newCache.error = error
        }),
    }

    this.cache.set(stringifiedKey, newCache)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw newCache.promise
  }

  public getData = <TKey extends Tuple>(key: TKey) => this.cache.get(JSON.stringify(key))?.data

  private keyNotifiesMap = new Map<string, ((...args: unknown[]) => unknown)[]>()

  public attach<TKey extends Tuple>(key: TKey, onNotify: (...args: unknown[]) => unknown) {
    const stringifiedKey = JSON.stringify(key)
    const keyNotifies = this.keyNotifiesMap.get(stringifiedKey)
    this.keyNotifiesMap.set(stringifiedKey, [...(keyNotifies ?? []), onNotify])

    const attached = {
      detach: () => this.detach(key, onNotify),
    }
    return attached
  }

  public detach<TKey extends Tuple>(key: TKey, onNotify: (...args: unknown[]) => unknown) {
    const stringifiedKey = JSON.stringify(key)
    const keyNotifies = this.keyNotifiesMap.get(stringifiedKey)

    if (keyNotifies) {
      this.keyNotifiesMap.set(
        stringifiedKey,
        keyNotifies.filter((notify) => notify !== onNotify)
      )
    }
  }

  private notifyToAttacher = <TKey extends string>(key?: TKey) =>
    key
      ? this.keyNotifiesMap.get(key)?.forEach((notify) => notify())
      : this.keyNotifiesMap.forEach((keyNotifies) => keyNotifies.forEach((notify) => notify()))
}

/**
 * @experimental This is experimental feature.
 */
export const suspensiveCache = new SuspensiveCacheObserver()
