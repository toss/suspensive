import type { ReactNode } from 'react'
import { useIsClient } from '../hooks'

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export const ClientOnly = ({ children, fallback }: ClientOnlyProps) => <>{useIsClient() ? children : fallback}</>
