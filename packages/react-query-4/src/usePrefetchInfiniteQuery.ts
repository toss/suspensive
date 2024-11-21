import { type FetchInfiniteQueryOptions, type QueryKey, useQueryClient } from '@tanstack/react-query'

/**
 * The `usePrefetchInfiniteQuery` does not return anything, it should be used just to fire a prefetch during render, before a suspense boundary that wraps a component that uses `useSuspenseInfiniteQuery`.
 * @see {@link https://suspensive.org/docs/react-query/usePrefetchInfiniteQuery Suspensive Docs}
 */
export function usePrefetchInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const queryClient = useQueryClient()

  if (typeof options.queryKey !== 'undefined' && !queryClient.getQueryState(options.queryKey)) {
    queryClient.prefetchInfiniteQuery(options)
  }
}
