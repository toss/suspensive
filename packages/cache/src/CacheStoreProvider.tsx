import { type PropsWithChildren } from 'react'
import type { CacheStore } from './CacheStore'
import { CacheStoreContext } from './contexts'

type CacheProviderProps = PropsWithChildren<{ store: CacheStore }>

/**
 * @experimental This is experimental feature.
 */
export const CacheStoreProvider = ({ store, children }: CacheProviderProps) => (
  <CacheStoreContext.Provider value={store}>{children}</CacheStoreContext.Provider>
)
