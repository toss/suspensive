import type { ReactNode } from 'react'
import { useIsClient } from '../hooks/useIsClient'

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export const ClientOnly = ({ children, fallback }: ClientOnlyProps) => <>{useIsClient() ? children : fallback}</>
