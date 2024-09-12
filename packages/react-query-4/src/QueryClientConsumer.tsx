import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * @experimental This is experimental feature.
 */
export function QueryClientConsumer({
  children,
  context,
}: {
  children: (queryClient: QueryClient) => ReactNode
  context?: React.Context<QueryClient | undefined>
}) {
  return <>{children(useQueryClient({ context }))}</>
}
