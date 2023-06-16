'use client'

import { useEffect, useMemo } from 'react'
import { useRerender } from './hooks'

type Tuple<T = unknown> = T[] | readonly T[]
type Cache<Key extends Tuple = Tuple> = {
  promise?: Promise<unknown>
  key: Key
  error?: unknown
  data?: unknown
}

class SuspenseCacheObserver {
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

    const detachSelf = () => this.detach(key, onNotify)
    return detachSelf
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
export const suspenseCache = new SuspenseCacheObserver()

type SuspenseCache<TData = unknown> = { data: TData; reset: () => void }

type UseSuspenseCacheOption<TData, TKey extends Tuple, TFn extends (options: { key: TKey }) => Promise<TData>> = {
  key: TKey
  fn: TFn
}

/**
 * @experimental This is experimental feature.
 */
export const useSuspenseCache = <TKey extends Tuple, TData>(
  options: UseSuspenseCacheOption<TData, TKey, (options: { key: TKey }) => Promise<TData>>
): SuspenseCache<TData> => {
  const data = suspenseCache.suspend(options.key, () => options.fn({ key: options.key }))

  const rerender = useRerender()
  const stringifiedKey = JSON.stringify(options.key)

  useEffect(() => suspenseCache.attach(options.key, rerender), [stringifiedKey, rerender])

  return useMemo(
    () => ({
      data,
      reset: () => suspenseCache.reset(options.key),
    }),
    [stringifiedKey, data]
  )
}
