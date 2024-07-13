import { useContext } from 'react'
import { CacheContext } from './contexts'

/**
 * @experimental This is experimental feature.
 */
export const useCache = () => {
  const cache = useContext(CacheContext)

  if (cache == null) {
    throw new Error('CacheProvider should be in parent')
  }

  return cache
}
