import { createContext } from 'react'
import type { DelayProps } from '../Delay'
import type { SuspenseProps } from '../Suspense'
import type { PropsWithoutChildren } from '../utility-types'

export const DelayDefaultOptionsContext = createContext<PropsWithoutChildren<DelayProps>>({ ms: 0 })
if (process.env.NODE_ENV !== 'production') {
  DelayDefaultOptionsContext.displayName = 'DelayDefaultOptionsContext'
}

export const SuspenseDefaultOptionsContext = createContext<PropsWithoutChildren<SuspenseProps>>({ fallback: undefined })
if (process.env.NODE_ENV !== 'production') {
  SuspenseDefaultOptionsContext.displayName = 'SuspenseDefaultOptionsContext'
}
