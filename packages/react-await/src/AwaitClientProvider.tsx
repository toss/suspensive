import { type PropsWithChildren } from 'react'
import type { AwaitClient } from './AwaitClient'
import { AwaitClientContext } from './contexts'

type AwaitClientProviderProps = PropsWithChildren<{ client: AwaitClient }>

export const AwaitClientProvider = ({ client, children }: AwaitClientProviderProps) => (
  <AwaitClientContext.Provider value={client}>{children}</AwaitClientContext.Provider>
)
