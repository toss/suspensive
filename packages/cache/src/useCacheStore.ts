import { useContext } from 'react'
import type { CacheStore } from './CacheStore'
import { CacheStoreContext } from './contexts'

/**
 * @experimental This is experimental feature.
 */
export function useCacheStore(): CacheStore {
  const cacheStore = useContext(CacheStoreContext)
  if (cacheStore == null) {
    throw new Error('CacheStoreProvider should be in parent')
  }
  return cacheStore
}
