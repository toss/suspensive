import { type PropsWithChildren } from 'react'
import type { Cache } from './Cache'
import { CacheContext } from './contexts'

type CacheProviderProps = PropsWithChildren<{ cache: Cache }>

/**
 * @experimental This is experimental feature.
 */
export function CacheProvider({ cache, children }: CacheProviderProps) {
  return <CacheContext.Provider value={cache}>{children}</CacheContext.Provider>
}
