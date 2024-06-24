import { type SuspenseProps } from 'react'
import { useIsClient } from './useIsClient'

export const ClientOnly = ({ children, fallback }: SuspenseProps) => {
  const isClient = useIsClient()

  return isClient ? <>{children}</> : <>{fallback}</>
}
