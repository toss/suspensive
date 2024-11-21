import { type FetchQueryOptions, type QueryKey, useQueryClient } from '@tanstack/react-query'

/**
 * The `usePrefetchQuery` does not return anything, it should be used just to fire a prefetch during render, before a suspense boundary that wraps a component that uses `useSuspenseQuery`.
 * @see {@link https://suspensive.org/docs/react-query/usePrefetchQuery Suspensive Docs}
 */
export function usePrefetchQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const queryClient = useQueryClient()

  if (typeof options.queryKey !== 'undefined' && !queryClient.getQueryState(options.queryKey)) {
    queryClient.prefetchQuery(options)
  }
}
