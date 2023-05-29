'use client'

import { useEffect, useMemo } from 'react'
import { useRerender } from './hooks'

type Tuple<T = unknown> = T[] | readonly T[]
type Cache<Key extends string = string> = {
  promise?: Promise<unknown>
  key: Key
  error?: unknown
  data?: unknown
}
type CacheAction = { reset: () => void }
type SuspenseCache<TData extends unknown = unknown> = CacheAction & { data: TData }

class SuspenseCacheObserver {
  private cache = new Map<string, Cache>()

  public reset = <TKey extends string>(key?: TKey) => {
    if (key === undefined || key.length === 0) {
      this.cache.clear()
      this.notifyToAttacher()
      return
    }

    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    this.notifyToAttacher(key)
  }

  public clearError = <TKey extends string>(key?: TKey) => {
    if (key === undefined || key.length === 0) {
      this.cache.forEach((value, key, map) => {
        map.set(key, { ...value, promise: undefined, error: undefined })
      })
      return
    }

    const cacheGot = this.cache.get(key)
    if (cacheGot) {
      this.cache.set(key, { ...cacheGot, promise: undefined, error: undefined })
    }
  }

  public suspend = <TKey extends string, TData extends unknown>(
    key: TKey,
    fn: (options: { key: TKey }) => Promise<TData>
  ): TData => {
    const cacheGot = this.cache.get(key)

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

    this.cache.set(key, newCache)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw newCache.promise
  }

  public getData = <TKey extends string>(key: TKey) => this.cache.get(key)?.data

  private keyNotifiesMap = new Map<string, ((...args: unknown[]) => unknown)[]>()

  public attach<TKey extends string>(key: TKey, onNotify: (...args: unknown[]) => unknown) {
    const keyNotifies = this.keyNotifiesMap.get(key)
    this.keyNotifiesMap.set(key, [...(keyNotifies ?? []), onNotify])
  }

  public detach<TKey extends string>(key: TKey, onNotify: (...args: unknown[]) => unknown) {
    const keyNotifies = this.keyNotifiesMap.get(key)

    if (keyNotifies) {
      this.keyNotifiesMap.set(
        key,
        keyNotifies.filter((notify) => notify !== onNotify)
      )
    }
  }

  private notifyToAttacher = <TKey extends string>(key?: TKey) =>
    key
      ? this.keyNotifiesMap.get(key)?.forEach((notify) => notify())
      : this.keyNotifiesMap.forEach((keyNotifies) => keyNotifies.forEach((notify) => notify()))
}

export const suspenseCache = new SuspenseCacheObserver()

type UseSuspenseCacheOption<
  TData extends unknown,
  TKey extends Tuple,
  TFn extends (options: { key: TKey }) => Promise<TData>
> = {
  key: TKey
  fn: TFn
}

export const useSuspenseCache = <TKey extends Tuple, TData extends unknown>(
  options: UseSuspenseCacheOption<TData, TKey, (options: { key: TKey }) => Promise<TData>>
): SuspenseCache<TData> => {
  const stringifiedKey = JSON.stringify(options.key)

  const data = suspenseCache.suspend(stringifiedKey, () => options.fn({ key: options.key }))

  const rerender = useRerender()

  useEffect(() => {
    suspenseCache.attach(stringifiedKey, rerender)
    return () => suspenseCache.detach(stringifiedKey, rerender)
  }, [stringifiedKey, rerender])

  return useMemo(
    () => ({
      data,
      reset: () => suspenseCache.reset(stringifiedKey),
    }),
    [data]
  )
}
