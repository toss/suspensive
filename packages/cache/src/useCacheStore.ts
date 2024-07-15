import { useContext } from 'react'
import { CacheStoreContext } from './contexts'

/**
 * @experimental This is experimental feature.
 */
export const useCacheStore = () => {
  const cache = useContext(CacheStoreContext)

  if (cache == null) {
    throw new Error('CacheStoreProvider should be in parent')
  }

  return cache
}
