'use client'

import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * @experimental This is experimental feature.
 */
export function QueryClientConsumer({
  children,
  queryClient,
}: {
  children: (queryClient: QueryClient) => ReactNode
  queryClient?: QueryClient
}) {
  return <>{children(useQueryClient(queryClient))}</>
}
