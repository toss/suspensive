import { createContext } from 'react'
import type { AwaitClient } from '../AwaitClient'

export const AwaitClientContext = createContext<AwaitClient | null>(null)
