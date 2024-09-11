import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export function QueryClientConsumer({
  children,
  context,
}: Readonly<{
  children: (queryClient: QueryClient) => ReactNode
  context?: React.Context<QueryClient | undefined>
}>) {
  return <>{children(useQueryClient({ context }))}</>
}
