import type { OmitKeyof } from '@suspensive/utils'
import { createContext } from 'react'
import type { DelayProps, SuspenseProps } from '..'

export const DelayDefaultPropsContext = createContext<OmitKeyof<DelayProps, 'children'>>({
  ms: undefined,
  fallback: undefined,
})
if (process.env.NODE_ENV === 'development') {
  DelayDefaultPropsContext.displayName = 'DelayDefaultPropsContext'
}

export const SuspenseDefaultPropsContext = createContext<OmitKeyof<SuspenseProps, 'children' | 'devMode'>>({
  fallback: undefined,
  clientOnly: undefined,
})
if (process.env.NODE_ENV === 'development') {
  SuspenseDefaultPropsContext.displayName = 'SuspenseDefaultPropsContext'
}
