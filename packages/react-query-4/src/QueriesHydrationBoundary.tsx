import {
  Hydrate,
  type HydrateProps,
  type OmitKeyof,
  QueryClient,
  type QueryOptions,
  type WithRequired,
  dehydrate,
} from '@tanstack/react-query'

/**
 * @experimental
 * This component is experimental and may be changed or removed in the future.
 */
export async function QueriesHydrationBoundary({
  queries,
  children,
  queryClient = new QueryClient(),
  ...props
}: {
  queryClient?: QueryClient
  queries: WithRequired<QueryOptions<any, any, any, any>, 'queryKey'>[]
} & OmitKeyof<HydrateProps, 'state'>) {
  await Promise.all(queries.map((query) => queryClient.ensureQueryData(query)))
  return (
    <Hydrate {...props} state={dehydrate(queryClient)}>
      {children}
    </Hydrate>
  )
}
