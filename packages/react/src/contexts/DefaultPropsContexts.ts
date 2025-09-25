import { createContext } from 'react'
import type { DelayProps, SuspenseProps, ErrorBoundaryProps } from '..'
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

export const ErrorBoundaryDefaultPropsContext = createContext<OmitKeyof<ErrorBoundaryProps, 'children' | 'fallback'>>({
  resetKeys: undefined,
  onReset: undefined,
  onError: undefined,
  shouldCatch: undefined,
})
ErrorBoundaryDefaultPropsContext.displayName = 'ErrorBoundaryDefaultPropsContext'
