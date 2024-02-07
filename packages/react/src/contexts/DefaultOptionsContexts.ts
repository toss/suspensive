import { createContext } from 'react'
import type { DelayProps, SuspenseProps } from '..'
import type { OmitKeyOf } from '../utility-types'

export const DelayDefaultPropsContext = createContext<DelayProps>({
  ms: undefined,
  fallback: undefined,
})
if (process.env.NODE_ENV === 'development') {
  DelayDefaultPropsContext.displayName = 'DelayDefaultPropsContext'
}

export const SuspenseDefaultPropsContext = createContext<OmitKeyOf<SuspenseProps, 'children' | 'devMode'>>({
  fallback: undefined,
  clientOnly: undefined,
})
if (process.env.NODE_ENV === 'development') {
  SuspenseDefaultPropsContext.displayName = 'SuspenseDefaultPropsContext'
}
