import 'server-only'
import { ClientOnly } from '@suspensive/react'
import { HydrationBoundary, type QueryOptions, type WithRequired, dehydrate } from '@tanstack/react-query'
import React from 'react'
import { getQueryClient } from '~/app/get-query-client'

export default async function PrefetchBoundary({
  queries,
  children,
}: {
  queries: WithRequired<QueryOptions<any, any, any, any>, 'queryKey'>[]
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  const results = await Promise.allSettled(queries.map((queryOption) => queryClient.fetchQuery(queryOption)))
  if (results.some((result) => result.status === 'rejected')) {
    return <ClientOnly>{children}</ClientOnly>
  }
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
}
