import { createContext } from 'react'
import type { DelayProps, SuspenseProps } from '..'
import type { OmitKeyof } from '../utility-types/OmitKeyof'

export const DelayDefaultPropsContext = createContext<OmitKeyof<DelayProps, 'children'>>({
  ms: undefined,
  fallback: undefined,
})
DelayDefaultPropsContext.displayName = 'DelayDefaultPropsContext'

export const SuspenseDefaultPropsContext = createContext<OmitKeyof<SuspenseProps, 'children'>>({
  fallback: undefined,
  clientOnly: undefined,
})
SuspenseDefaultPropsContext.displayName = 'SuspenseDefaultPropsContext'
