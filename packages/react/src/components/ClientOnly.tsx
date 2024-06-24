import type { ReactNode } from 'react'
import { useIsClient } from './useIsClient'

interface ClientOnlyProp {
  children: ReactNode
  fallback?: ReactNode
}

export const ClientOnly = ({ children, fallback }: ClientOnlyProp) => {
  const isClient = useIsClient()

  return isClient ? <>{children}</> : <>{fallback}</>
}
