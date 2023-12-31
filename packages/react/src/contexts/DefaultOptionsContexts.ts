import { createContext } from 'react'
import { type DelayProps } from '../Delay'
import { type SuspenseProps } from '../Suspense'
import { type PropsWithoutChildren, type PropsWithoutDevMode } from '../utility-types'

export const DelayDefaultPropsContext = createContext<PropsWithoutDevMode<PropsWithoutChildren<DelayProps>>>({
  ms: undefined,
})
if (process.env.NODE_ENV !== 'production') {
  DelayDefaultPropsContext.displayName = 'DelayDefaultPropsContext'
}

export const SuspenseDefaultPropsContext = createContext<PropsWithoutDevMode<PropsWithoutChildren<SuspenseProps>>>({
  fallback: undefined,
  clientOnly: undefined,
})
if (process.env.NODE_ENV !== 'production') {
  SuspenseDefaultPropsContext.displayName = 'SuspenseDefaultPropsContext'
}
