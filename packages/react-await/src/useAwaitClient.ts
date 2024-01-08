import { useContext } from 'react'
import { AwaitClientContext } from './contexts'

export const useAwaitClient = () => {
  const awaitClient = useContext(AwaitClientContext)

  if (awaitClient == null) {
    throw new Error('AwaitClientProvider should be in parent')
  }

  return awaitClient
}
