import { type PropsWithChildren } from 'react'
import type { CacheStore } from './CacheStore'
import { CacheStoreContext } from './contexts'

type CacheProviderProps = PropsWithChildren<{ store: CacheStore }>

/**
 * @experimental This is experimental feature.
 */
export function CacheStoreProvider({ store, children }: CacheProviderProps) {
  return <CacheStoreContext.Provider value={store}>{children}</CacheStoreContext.Provider>
}
