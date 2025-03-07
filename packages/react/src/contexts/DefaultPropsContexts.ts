import { createContext } from 'react'
import type { DelayProps, SuspenseProps } from '..'
import type { OmitKeyof } from '../utility-types'

export const DelayDefaultPropsContext = Object.assign(
  createContext<OmitKeyof<DelayProps, 'children'>>({ ms: undefined, fallback: undefined }),
  { displayName: 'DelayDefaultPropsContext' }
)

export const SuspenseDefaultPropsContext = Object.assign(
  createContext<OmitKeyof<SuspenseProps, 'children'>>({ fallback: undefined, clientOnly: undefined }),
  { displayName: 'SuspenseDefaultPropsContext' }
)
