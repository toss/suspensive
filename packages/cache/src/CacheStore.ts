import type { CacheKey, CacheOptions } from './types'
import type { ExtractPartial } from './utility-types/ExtractPartial'
import { hashCacheKey } from './utils'

const enum CacheStatus {
  Idle = 'idle',
  Pending = 'pending',
  Resolved = 'resolved',
  Rejected = 'rejected',
}

type Sync = (...args: unknown[]) => unknown

export type AllStatusCached<TData, TCacheKey extends CacheKey = CacheKey> =
  | {
      status: CacheStatus.Idle
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
      status: CacheStatus.Pending
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
      status: CacheStatus.Resolved
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
      status: CacheStatus.Rejected
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
  extends ExtractPartial<AllStatusCached<TData, TCacheKey>, { status: CacheStatus.Idle }> {}
export interface PendingCached<TData, TCacheKey extends CacheKey = CacheKey>
  extends ExtractPartial<AllStatusCached<TData, TCacheKey>, { status: CacheStatus.Pending }> {}
export interface ResolvedCached<TData, TCacheKey extends CacheKey = CacheKey>
  extends ExtractPartial<AllStatusCached<TData, TCacheKey>, { status: CacheStatus.Resolved }> {}
export interface RejectedCached<TData, TCacheKey extends CacheKey = CacheKey>
  extends ExtractPartial<AllStatusCached<TData, TCacheKey>, { status: CacheStatus.Rejected }> {}

export type Cached<TData, TCacheKey extends CacheKey = CacheKey> =
  | IdleCached<TData, TCacheKey>
  | PendingCached<TData, TCacheKey>
  | ResolvedCached<TData, TCacheKey>
  | RejectedCached<TData, TCacheKey>

/**
 * @experimental This is experimental feature.
 */
export class CacheStore {
  private cacheStore = new Map<ReturnType<typeof hashCacheKey>, Cached<unknown>>()
  private syncsMap = new Map<ReturnType<typeof hashCacheKey>, Array<Sync>>()

  public reset = (options?: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) => {
    if (typeof options?.cacheKey === 'undefined' || options.cacheKey.length === 0) {
      this.cacheStore.clear()
      this.syncSubscribers()
      return
    }

    const hashedCacheKey = hashCacheKey(options.cacheKey)

    if (this.cacheStore.has(hashedCacheKey)) {
      this.cacheStore.delete(hashedCacheKey)
    }

    this.syncSubscribers(options.cacheKey)
  }

  public remove = (options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) => {
    const hashedCacheKey = hashCacheKey(options.cacheKey)

    if (this.cacheStore.has(hashedCacheKey)) {
      this.cacheStore.delete(hashedCacheKey)
    }
  }

  public clearError = (options?: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) => {
    if (options?.cacheKey === undefined || options.cacheKey.length === 0) {
      this.cacheStore.forEach((cached, hashedCacheKey, cache) => {
        cache.set(hashedCacheKey, {
          ...cached,
          status: CacheStatus.Idle,
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
    const cached = this.cacheStore.get(hashedCacheKey)
    if (cached) {
      this.cacheStore.set(hashedCacheKey, {
        ...cached,
        status: CacheStatus.Idle,
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
    const cached = this.cacheStore.get(hashedCacheKey)
    if (cached && cached.status !== CacheStatus.Idle) {
      if (cached.status === CacheStatus.Rejected) {
        throw cached.state.error
      }
      if (cached.status === CacheStatus.Resolved) {
        return cached as ResolvedCached<TData, TCacheKey>
      }
      throw cached.promiseToSuspend
    }

    const promise = cacheFn({ cacheKey })
    const newCached: Cached<TData, TCacheKey> = {
      cacheKey,
      hashedCacheKey,
      status: CacheStatus.Pending,
      state: {
        promise,
        data: undefined,
        error: undefined,
      },
      promiseToSuspend: promise.then(
        (data) => {
          newCached.status = CacheStatus.Resolved
          newCached.state.data = data
          newCached.state.error = undefined
        },
        (error: unknown) => {
          newCached.status = CacheStatus.Rejected
          newCached.state.data = undefined
          newCached.state.error = error
        }
      ),
    }

    this.cacheStore.set(hashedCacheKey, newCached)

    throw newCached.promiseToSuspend
  }

  public getData = (options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) =>
    this.cacheStore.get(hashCacheKey(options.cacheKey))?.state.data
  public getError = (options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) =>
    this.cacheStore.get(hashCacheKey(options.cacheKey))?.state.error

  public subscribe(options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>, syncSubscriber: Sync) {
    const hashedCacheKey = hashCacheKey(options.cacheKey)
    const syncs = this.syncsMap.get(hashedCacheKey)
    this.syncsMap.set(hashedCacheKey, [...(syncs ?? []), syncSubscriber])

    const subscribed = {
      unsubscribe: () => this.unsubscribe(options, syncSubscriber),
    }
    return subscribed
  }

  public unsubscribe(options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>, syncSubscriber: Sync) {
    const hashedCacheKey = hashCacheKey(options.cacheKey)
    const syncs = this.syncsMap.get(hashedCacheKey)

    if (syncs) {
      this.syncsMap.set(
        hashedCacheKey,
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
