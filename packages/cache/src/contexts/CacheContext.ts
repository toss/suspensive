import { createContext } from 'react'
import type { Cache } from '../Cache'

export const CacheContext = createContext<Cache | null>(null)
