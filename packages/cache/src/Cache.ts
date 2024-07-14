import type { CacheKey, CacheOptions } from './types'
import type { ExtractPartial } from './utility-types/ExtractPartial'
import { hashCacheKey } from './utils'

type Sync = (...args: unknown[]) => unknown

export type AllStatusCached<TData, TCacheKey extends CacheKey = CacheKey> =
  | {
      status: 'idle'
      promiseToSuspend: undefined
      cacheKey: TCacheKey
      hashedCacheKey: ReturnType<typeof hashCacheKey>
      state: {
        promise: undefined
        data: undefined
        error: undefined
      }
    }
  | {
      status: 'pending'
      promiseToSuspend: Promise<void>
      cacheKey: TCacheKey
      hashedCacheKey: ReturnType<typeof hashCacheKey>
      state: {
        promise: Promise<TData>
        data: undefined
        error: undefined
      }
    }
  | {
      status: 'resolved'
      promiseToSuspend: Promise<void>
      cacheKey: TCacheKey
      hashedCacheKey: ReturnType<typeof hashCacheKey>
      state: {
        promise: Promise<TData>
        data: TData
        error: undefined
      }
    }
  | {
      status: 'rejected'
      promiseToSuspend: Promise<void>
      cacheKey: TCacheKey
      hashedCacheKey: ReturnType<typeof hashCacheKey>
      state: {
        promise: Promise<TData>
        data: undefined
        error: unknown
      }
    }

export interface IdleCached<TData, TCacheKey extends CacheKey = CacheKey>
  extends ExtractPartial<AllStatusCached<TData, TCacheKey>, { status: 'idle' }> {}
export interface PendingCached<TData, TCacheKey extends CacheKey = CacheKey>
  extends ExtractPartial<AllStatusCached<TData, TCacheKey>, { status: 'pending' }> {}
export interface ResolvedCached<TData, TCacheKey extends CacheKey = CacheKey>
  extends ExtractPartial<AllStatusCached<TData, TCacheKey>, { status: 'resolved' }> {}
export interface RejectedCached<TData, TCacheKey extends CacheKey = CacheKey>
  extends ExtractPartial<AllStatusCached<TData, TCacheKey>, { status: 'rejected' }> {}

export type Cached<TData, TCacheKey extends CacheKey = CacheKey> =
  | IdleCached<TData, TCacheKey>
  | PendingCached<TData, TCacheKey>
  | ResolvedCached<TData, TCacheKey>
  | RejectedCached<TData, TCacheKey>

/**
 * @experimental This is experimental feature.
 */
export class Cache {
  private cache = new Map<ReturnType<typeof hashCacheKey>, Cached<unknown>>()
  private syncsMap = new Map<ReturnType<typeof hashCacheKey>, Array<Sync>>()

  public reset = (options?: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) => {
    if (typeof options?.cacheKey === 'undefined' || options.cacheKey.length === 0) {
      this.cache.clear()
      this.syncSubscribers()
      return
    }

    const hashedKey = hashCacheKey(options.cacheKey)

    if (this.cache.has(hashedKey)) {
      this.cache.delete(hashedKey)
    }

    this.syncSubscribers(options.cacheKey)
  }

  public clearError = (options?: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) => {
    if (options?.cacheKey === undefined || options.cacheKey.length === 0) {
      this.cache.forEach((cached, hashedCacheKey, cache) => {
        cache.set(hashedCacheKey, {
          ...cached,
          status: 'idle',
          promiseToSuspend: undefined,
          state: {
            promise: undefined,
            error: undefined,
            data: undefined,
          },
        })
      })
      return
    }

    const hashedCacheKey = hashCacheKey(options.cacheKey)
    const cachedState = this.cache.get(hashedCacheKey)
    if (cachedState) {
      this.cache.set(hashedCacheKey, {
        ...cachedState,
        status: 'idle',
        promiseToSuspend: undefined,
        state: {
          promise: undefined,
          error: undefined,
          data: undefined,
        },
      })
    }
  }

  public suspend = <TData, TCacheKey extends CacheKey = CacheKey>({
    cacheKey,
    cacheFn,
  }: CacheOptions<TData, TCacheKey>): ResolvedCached<TData, TCacheKey> => {
    const hashedCacheKey = hashCacheKey(cacheKey)
    const cached = this.cache.get(hashedCacheKey)
    if (cached && cached.status !== 'idle') {
      if (cached.status === 'rejected') {
        throw cached.state.error
      }
      if (cached.status === 'resolved') {
        return cached as ResolvedCached<TData, TCacheKey>
      }
      throw cached.promiseToSuspend
    }

    const promise = cacheFn({ cacheKey })
    const newCached: Cached<TData, TCacheKey> = {
      cacheKey,
      hashedCacheKey,
      status: 'pending',
      state: {
        promise,
        data: undefined,
        error: undefined,
      },
      promiseToSuspend: promise.then(
        (data) => {
          newCached.status = 'resolved'
          newCached.state.data = data
          newCached.state.error = undefined
        },
        (error: unknown) => {
          newCached.status = 'rejected'
          newCached.state.data = undefined
          newCached.state.error = error
        }
      ),
    }

    this.cache.set(hashedCacheKey, newCached)

    throw newCached.promiseToSuspend
  }

  public getData = (options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) =>
    this.cache.get(hashCacheKey(options.cacheKey))?.state.data
  public getError = (options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) =>
    this.cache.get(hashCacheKey(options.cacheKey))?.state.error

  public subscribe(options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>, syncSubscriber: Sync) {
    const hashedKey = hashCacheKey(options.cacheKey)
    const syncs = this.syncsMap.get(hashedKey)
    this.syncsMap.set(hashedKey, [...(syncs ?? []), syncSubscriber])

    const subscribed = {
      unsubscribe: () => this.unsubscribe(options, syncSubscriber),
    }
    return subscribed
  }

  public unsubscribe(options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>, syncSubscriber: Sync) {
    const hashedKey = hashCacheKey(options.cacheKey)
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
