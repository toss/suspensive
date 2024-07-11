import { createContext } from 'react'
import type { PromiseCache } from '../PromiseCache'

export const PromiseCacheContext = createContext<PromiseCache | null>(null)
