import {
  HydrationBoundary,
  type HydrationBoundaryProps,
  type OmitKeyof,
  QueryClient,
  type QueryOptions,
  type WithRequired,
  dehydrate,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ClientOnly } from './components/ClientOnly'

/**
 * @experimental
 * This component is experimental and may be changed or removed in the future.
 */
export async function QueriesHydrationBoundary({
  queries,
  children,
  queryClient = new QueryClient(),
  clientOnlyOnError = true,
  ...props
}: {
  queries: WithRequired<QueryOptions<any, any, any, any>, 'queryKey'>[]
  clientOnlyOnError?: boolean | { fallback: ReactNode }
} & OmitKeyof<HydrationBoundaryProps, 'state'>) {
  try {
    await Promise.all(queries.map((query) => queryClient.ensureQueryData(query)))
  } catch {
    if (clientOnlyOnError) {
      return (
        <ClientOnly fallback={clientOnlyOnError === true ? undefined : clientOnlyOnError.fallback}>
          {children}
        </ClientOnly>
      )
    }
    return (
      <HydrationBoundary {...props} state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
    )
  }
  return (
    <HydrationBoundary {...props} state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
