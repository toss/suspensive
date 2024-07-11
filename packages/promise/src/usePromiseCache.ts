import { useContext } from 'react'
import { PromiseCacheContext } from './contexts'

/**
 * @experimental This is experimental feature.
 */
export const usePromiseCache = () => {
  const promiseCache = useContext(PromiseCacheContext)

  if (promiseCache == null) {
    throw new Error('PromiseCacheProvider should be in parent')
  }

  return promiseCache
}
