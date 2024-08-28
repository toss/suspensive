import { Subscribable } from './models/Subscribable'
import type { CacheKey, CacheOptions } from './types'
import type { ExtractPartial } from './utility-types/ExtractPartial'
import { hashCacheKey } from './utils'

const enum CacheStatus {
  Idle = 'idle',
  Pending = 'pending',
  Resolved = 'resolved',
  Rejected = 'rejected',
}

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

export type IdleCached<TData, TCacheKey extends CacheKey = CacheKey> = ExtractPartial<
  AllStatusCached<TData, TCacheKey>,
  { status: CacheStatus.Idle }
>
export type PendingCached<TData, TCacheKey extends CacheKey = CacheKey> = ExtractPartial<
  AllStatusCached<TData, TCacheKey>,
  { status: CacheStatus.Pending }
>
export type ResolvedCached<TData, TCacheKey extends CacheKey = CacheKey> = ExtractPartial<
  AllStatusCached<TData, TCacheKey>,
  { status: CacheStatus.Resolved }
>
export type RejectedCached<TData, TCacheKey extends CacheKey = CacheKey> = ExtractPartial<
  AllStatusCached<TData, TCacheKey>,
  { status: CacheStatus.Rejected }
>

export type Cached<TData, TCacheKey extends CacheKey = CacheKey> =
  | IdleCached<TData, TCacheKey>
  | PendingCached<TData, TCacheKey>
  | ResolvedCached<TData, TCacheKey>
  | RejectedCached<TData, TCacheKey>

/**
 * @experimental This is experimental feature.
 */
export class Cache extends Subscribable<() => void> {
  private cache = new Map<ReturnType<typeof hashCacheKey>, Cached<unknown>>()

  public reset = (options?: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) => {
    if (typeof options?.cacheKey === 'undefined' || options.cacheKey.length === 0) {
      this.cache.clear()
      this.notify()
      return
    }

    const hashedCacheKey = hashCacheKey(options.cacheKey)

    if (this.cache.has(hashedCacheKey)) {
      this.cache.delete(hashedCacheKey)
    }

    this.notify()
  }

  public remove = (options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) => {
    const hashedCacheKey = hashCacheKey(options.cacheKey)

    if (this.cache.has(hashedCacheKey)) {
      this.cache.delete(hashedCacheKey)
    }
  }

  public clearError = (options?: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) => {
    if (options?.cacheKey === undefined || options.cacheKey.length === 0) {
      this.cache.forEach((cached, hashedCacheKey, cache) => {
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
    const cached = this.cache.get(hashedCacheKey)
    if (cached) {
      this.cache.set(hashedCacheKey, {
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
    const cached = this.cache.get(hashedCacheKey)
    if (cached && cached.status !== CacheStatus.Idle) {
      if (cached.status === CacheStatus.Rejected) {
        throw cached.state.error
      }
      if (cached.status === CacheStatus.Resolved) {
        return cached as ResolvedCached<TData, TCacheKey>
      }
      // eslint-disable-next-line @typescript-eslint/only-throw-error
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

    this.cache.set(hashedCacheKey, newCached)
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw newCached.promiseToSuspend
  }

  public getData = (options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) =>
    this.cache.get(hashCacheKey(options.cacheKey))?.state.data
  public getError = (options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>) =>
    this.cache.get(hashCacheKey(options.cacheKey))?.state.error
}
