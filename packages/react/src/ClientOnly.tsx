import type { ReactNode } from 'react'
import { useIsClient } from './hooks'

export interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export const ClientOnly = ({ children, fallback }: ClientOnlyProps) => <>{useIsClient() ? children : fallback}</>
