import type { ReactNode } from 'react'
import { useIsClient } from './hooks'

export interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * This component ensures its children are only rendered on the client-side.
 * @see {@link https://suspensive.org/docs/react/ClientOnly Suspensive Docs}
 */
export const ClientOnly = ({ children, fallback }: ClientOnlyProps) => <>{useIsClient() ? children : fallback}</>
