'use client'

import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import type { Context, ReactNode } from 'react'

/**
 * @experimental This is experimental feature.
 */
export function QueryClientConsumer({
  children,
  context,
}: {
  children: (queryClient: QueryClient) => ReactNode
  context?: Context<QueryClient | undefined>
}) {
  return <>{children(useQueryClient({ context: context as any }))}</>
}
