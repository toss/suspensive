import { type QueryClient as TQueryClient, useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export function QueryClient({
  children,
  context,
}: Readonly<{
  children: (queryClient: TQueryClient) => ReactNode
  context?: React.Context<TQueryClient | undefined>
}>) {
  return <>{children(useQueryClient({ context }))}</>
}
