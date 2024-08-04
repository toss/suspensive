import type { CacheKey, CacheOptions, Sync } from '../types'
import { hashCacheKey } from '../utils'

export class Subscribable {
  protected syncsMap: Map<ReturnType<typeof hashCacheKey>, Array<Sync>>

  constructor() {
    this.syncsMap = new Map()
    this.subscribe = this.subscribe.bind(this)
  }

  public subscribe(options: Pick<CacheOptions<unknown, CacheKey>, 'cacheKey'>, syncSubscriber: Sync) {
    const hashedCacheKey = hashCacheKey(options.cacheKey)
    const syncs = this.syncsMap.get(hashedCacheKey)
    this.syncsMap.set(hashedCacheKey, [...(syncs ?? []), syncSubscriber])

    const unsubscribe = () => {
      if (syncs) {
        this.syncsMap.set(
          hashedCacheKey,
          syncs.filter((sync) => sync !== syncSubscriber)
        )
      }
    }
    return unsubscribe
  }

  protected syncSubscribers = (cacheKey?: CacheKey) => {
    const hashedCacheKey = cacheKey ? hashCacheKey(cacheKey) : undefined

    if (hashedCacheKey) {
      this.syncsMap.get(hashedCacheKey)?.forEach((sync) => sync())
    } else {
      this.syncsMap.forEach((syncs) => syncs.forEach((sync) => sync()))
    }
  }
}
