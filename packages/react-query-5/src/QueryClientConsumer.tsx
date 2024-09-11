import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export function QueryClientConsumer({
  children,
  queryClient,
}: Readonly<{
  children: (queryClient: QueryClient) => ReactNode
  queryClient?: QueryClient
}>) {
  return <>{children(useQueryClient(queryClient))}</>
}
