import { createContext } from 'react'
import type { CacheStore } from '../CacheStore'

export const CacheStoreContext = createContext<CacheStore | null>(null)
