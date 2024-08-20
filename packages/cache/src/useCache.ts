import { useContext } from 'react'
import type { Cache } from './Cache'
import { CacheContext } from './contexts'

/**
 * @experimental This is experimental feature.
 */
export function useCache(): Cache {
  const cache = useContext(CacheContext)
  if (cache == null) {
    throw new Error('CacheProvider should be in parent')
  }
  return cache
}
