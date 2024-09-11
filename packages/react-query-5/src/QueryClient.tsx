import { type QueryClient as TQueryClient, useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export function QueryClient({
  children,
  queryClient,
}: Readonly<{
  children: (queryClient: TQueryClient) => ReactNode
  queryClient?: TQueryClient
}>) {
  return <>{children(useQueryClient(queryClient))}</>
}
