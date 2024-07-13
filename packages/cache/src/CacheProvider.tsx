import { type PropsWithChildren } from 'react'
import type { Cache } from './Cache'
import { CacheContext } from './contexts'

type CacheProviderProps = PropsWithChildren<{ cache: Cache }>

/**
 * @experimental This is experimental feature.
 */
export const CacheProvider = ({ cache, children }: CacheProviderProps) => (
  <CacheContext.Provider value={cache}>{children}</CacheContext.Provider>
)
