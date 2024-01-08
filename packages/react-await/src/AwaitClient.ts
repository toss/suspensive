import { AwaitState } from './AwaitState'
import type { AwaitOptions, HashedKey, Key } from './types'
import { hashKey } from './utils'

type Sync = (...args: unknown[]) => unknown

/**
 * @experimental This is experimental feature.
 */
export class AwaitClient {
  private cache = new Map<HashedKey, AwaitState>()
  private syncsMap = new Map<HashedKey, Sync[]>()

  public reset = (key?: Key) => {
    if (key === undefined || key.length === 0) {
      this.cache.clear()
      this.syncSubscribers()
      return
    }

    const hashedKey = hashKey(key)

    if (this.cache.has(hashedKey)) {
      this.cache.delete(hashedKey)
    }

    this.syncSubscribers(key)
  }

  public clearError = (key?: Key) => {
    if (key === undefined || key.length === 0) {
      this.cache.forEach((cachedAwaitState) => {
        cachedAwaitState.promise = undefined
        cachedAwaitState.error = undefined
      })
      return
    }

    const hashedKey = hashKey(key)
    const cachedAwaitState = this.cache.get(hashedKey)
    if (cachedAwaitState) {
      cachedAwaitState.promise = undefined
      cachedAwaitState.error = undefined
    }
  }

  public invalidate = (key: Key) => {
    const hashedKey = hashKey(key)
    const cachedAwaitState = this.cache.get(hashedKey)

    if (cachedAwaitState) {
      cachedAwaitState
    }
  }

  public suspend = <TData, TKey extends Key = Key>({
    key,
    fn,
    gcTime = 300,
  }: AwaitOptions<TData, TKey>): AwaitState<TData, TKey> => {
    const hashedKey = hashKey(key)
    const cachedAwaitState = this.cache.get(hashedKey)

    if (cachedAwaitState) {
      if (cachedAwaitState.error) {
        throw cachedAwaitState.error
      }
      if (cachedAwaitState.data) {
        return cachedAwaitState as unknown as AwaitState<TData, TKey>
      }

      if (cachedAwaitState.promise) {
        throw cachedAwaitState.promise
      }
    }

    const newAwaitState = new AwaitState({ key, fn, gcTime }, this)
    this.cache.set(hashedKey, newAwaitState as unknown as AwaitState)
    throw newAwaitState.promise
  }

  public subscribe(key: Key, syncSubscriber: Sync) {
    const hashedKey = hashKey(key)
    const syncs = this.syncsMap.get(hashedKey)
    this.syncsMap.set(hashedKey, [...(syncs ?? []), syncSubscriber])

    const unsubscribe = () => {
      if (syncs) {
        this.syncsMap.set(
          hashedKey,
          syncs.filter((sync) => sync !== syncSubscriber)
        )
      }
    }
    return unsubscribe
  }

  public syncSubscribers = (key?: Key) => {
    const hashedKey = key ? hashKey(key) : undefined

    return hashedKey
      ? this.syncsMap.get(hashedKey)?.forEach((sync) => sync())
      : this.syncsMap.forEach((syncs) => syncs.forEach((sync) => sync()))
  }
}
