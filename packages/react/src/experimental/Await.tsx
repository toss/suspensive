import { FunctionComponent, createElement, useMemo } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'
import { Tuple } from '../types'
import { hashKey } from '../utils'

export type Key = Tuple

type AwaitOptions<TData, TKey extends Key> = {
  key: TKey
  fn: (options: { key: TKey }) => Promise<TData>
}

type Sync = (...args: unknown[]) => unknown

type AwaitState<TKey extends Key = Key> = {
  promise?: Promise<unknown>
  key: TKey
  hashedKey: ReturnType<typeof hashKey>
  error?: unknown
  data?: unknown
}

type Awaited<TData> = {
  data: TData
  reset: () => void
}

/**
 * @experimental This is experimental feature.
 */
export const useAwait = <TData, TKey extends Key>(options: AwaitOptions<TData, TKey>): Awaited<TData> => {
  const syncData = () => awaitClient.suspend(options)
  const data = useSyncExternalStore<TData>(
    (sync) => awaitClient.subscribe(options.key, sync).unsubscribe,
    syncData,
    syncData
  )

  return useMemo(
    () => ({
      key: options.key,
      data,
      reset: () => awaitClient.reset(options.key),
    }),
    [data, options.key]
  )
}

type AwaitProps<TData, TKey extends Key> = {
  options: AwaitOptions<TData, TKey>
  children: FunctionComponent<Awaited<TData>>
}

/**
 * @experimental This is experimental feature.
 */
export const Await = <TData, TKey extends Key>({ children, options }: AwaitProps<TData, TKey>) =>
  createElement(children, useAwait<TData, TKey>(options))

class AwaitClient {
  private cache = new Map<ReturnType<typeof hashKey>, AwaitState>()
  private syncsMap = new Map<ReturnType<typeof hashKey>, Sync[]>()

  public reset = <TKey extends Key>(key?: TKey) => {
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

  public clearError = <TKey extends Key>(key?: TKey) => {
    if (key === undefined || key.length === 0) {
      this.cache.forEach((value, key, map) => {
        map.set(key, { ...value, promise: undefined, error: undefined })
      })
      return
    }

    const hashedKey = hashKey(key)
    const awaitState = this.cache.get(hashedKey)
    if (awaitState) {
      // TODO: clearError with key index hierarchy
      this.cache.set(hashedKey, { ...awaitState, promise: undefined, error: undefined })
    }
  }

  public suspend = <TKey extends Key, TData>({ key, fn }: AwaitOptions<TData, TKey>): TData => {
    const hashedKey = hashKey(key)
    const awaitState = this.cache.get(hashedKey)

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

    this.cache.set(hashedKey, newAwaitState)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw newAwaitState.promise
  }

  public getData = <TKey extends Key>(key: TKey) => this.cache.get(hashKey(key))?.data

  public subscribe<TKey extends Key>(key: TKey, syncSubscriber: Sync) {
    const hashedKey = hashKey(key)
    const syncs = this.syncsMap.get(hashedKey)
    this.syncsMap.set(hashedKey, [...(syncs ?? []), syncSubscriber])

    const subscribed = {
      unsubscribe: () => this.unsubscribe(key, syncSubscriber),
    }
    return subscribed
  }

  public unsubscribe<TKey extends Key>(key: TKey, syncSubscriber: Sync) {
    const hashedKey = hashKey(key)
    const syncs = this.syncsMap.get(hashedKey)

    if (syncs) {
      this.syncsMap.set(
        hashedKey,
        syncs.filter((sync) => sync !== syncSubscriber)
      )
    }
  }

  private syncSubscribers = <TKey extends Key>(key?: TKey) => {
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
