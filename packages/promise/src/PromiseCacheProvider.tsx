import { type PropsWithChildren } from 'react'
import { PromiseCacheContext } from './contexts'
import type { PromiseCache } from './PromiseCache'

type PromiseCacheProviderProps = PropsWithChildren<{ cache: PromiseCache }>

/**
 * @experimental This is experimental feature.
 */
export const PromiseCacheProvider = ({ cache, children }: PromiseCacheProviderProps) => (
  <PromiseCacheContext.Provider value={cache}>{children}</PromiseCacheContext.Provider>
)
