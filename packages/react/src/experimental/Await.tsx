import { FunctionComponent, createElement, useMemo } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'
import { Tuple } from '../types'

const hashKey = <TKey extends Tuple>(key: TKey) => JSON.stringify(key)
type HashedKey = ReturnType<typeof hashKey>
type Awaited<TData = unknown> = { data: TData; reset: () => void }
type AwaitOptions<TData, TKey extends Tuple> = {
  key: TKey
  fn: (options: { key: TKey }) => Promise<TData>
}
type AwaitState<TKey extends Tuple = Tuple> = {
  promise?: Promise<unknown>
  key: TKey
  hashedKey: HashedKey
  error?: unknown
  data?: unknown
}

/**
 * @experimental This is experimental feature.
 */
export const awaitOptions = <TData, TKey extends Tuple>(options: AwaitOptions<TData, TKey>) => options

/**
 * @experimental This is experimental feature.
 */
export const useAwait = <TData, TKey extends Tuple>(options: AwaitOptions<TData, TKey>): Awaited<TData> => {
  const syncData = () => awaitClient.suspend(options)
  const data = useSyncExternalStore<TData>(
    (sync) => awaitClient.subscribe(options.key, sync).unsubscribe,
    syncData,
    syncData
  )

  return useMemo(
    () => ({
      data,
      reset: () => awaitClient.reset(options.key),
    }),
    [data, options.key]
  )
}

type AwaitProps<TData, TKey extends Tuple> = {
  options: AwaitOptions<TData, TKey>
  children: FunctionComponent<Awaited<TData>>
}

/**
 * @experimental This is experimental feature.
 */
export const Await = <TData, TKey extends Tuple>({ children, options }: AwaitProps<TData, TKey>) =>
  createElement(children, useAwait<TData, TKey>(options))

class AwaitClient {
  private awaitCache = new Map<HashedKey, AwaitState>()
  private syncsMap = new Map<HashedKey, ((...args: unknown[]) => unknown)[]>()

  public reset = <TKey extends Tuple>(key?: TKey) => {
    if (key === undefined || key.length === 0) {
      this.awaitCache.clear()
      this.syncSubscribers()
      return
    }

    const hashedKey = hashKey(key)

    if (this.awaitCache.has(hashedKey)) {
      // TODO: reset with key index hierarchy
      this.awaitCache.delete(hashedKey)
    }

    this.syncSubscribers(key)
  }

  public clearError = <TKey extends Tuple>(key?: TKey) => {
    if (key === undefined || key.length === 0) {
      this.awaitCache.forEach((value, key, map) => {
        map.set(key, { ...value, promise: undefined, error: undefined })
      })
      return
    }

    const hashedKey = hashKey(key)
    const awaitCacheGot = this.awaitCache.get(hashedKey)
    if (awaitCacheGot) {
      // TODO: clearError with key index hierarchy
      this.awaitCache.set(hashedKey, { ...awaitCacheGot, promise: undefined, error: undefined })
    }
  }

  public suspend = <TKey extends Tuple, TData>({ key, fn }: AwaitOptions<TData, TKey>): TData => {
    const hashedKey = hashKey(key)
    const awaitState = this.awaitCache.get(hashedKey)

    if (awaitState?.error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw awaitState.error
    }
    if (awaitState?.data) {
      return awaitState.data as TData
    }

    if (awaitState?.promise) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw awaitState.promise
    }

    const newAwaitState: AwaitState<TKey> = {
      key,
      hashedKey,
      promise: fn({ key })
        .then((data) => {
          newAwaitState.data = data
        })
        .catch((error) => {
          newAwaitState.error = error
        }),
    }

    this.awaitCache.set(hashedKey, newAwaitState)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw newAwaitState.promise
  }

  public getData = <TKey extends Tuple>(key: TKey) => this.awaitCache.get(hashKey(key))?.data

  public subscribe<TKey extends Tuple>(key: TKey, syncSubscriber: (...args: unknown[]) => unknown) {
    const hashedKey = hashKey(key)
    const syncs = this.syncsMap.get(hashedKey)
    this.syncsMap.set(hashedKey, [...(syncs ?? []), syncSubscriber])

    const subscribed = {
      unsubscribe: () => this.unsubscribe(key, syncSubscriber),
    }
    return subscribed
  }

  public unsubscribe<TKey extends Tuple>(key: TKey, syncSubscriber: (...args: unknown[]) => unknown) {
    const hashedKey = hashKey(key)
    const syncs = this.syncsMap.get(hashedKey)

    if (syncs) {
      this.syncsMap.set(
        hashedKey,
        syncs.filter((sync) => sync !== syncSubscriber)
      )
    }
  }

  private syncSubscribers = <TKey extends Tuple>(key?: TKey) => {
    const hashedKey = key ? hashKey(key) : undefined

    return hashedKey
      ? this.syncsMap.get(hashedKey)?.forEach((sync) => sync())
      : this.syncsMap.forEach((syncs) => syncs.forEach((sync) => sync()))
  }
}

/**
 * @experimental This is experimental feature.
 */
export const awaitClient = new AwaitClient()
