import { type FetchInfiniteQueryOptions, type QueryKey, useQueryClient } from '@tanstack/react-query'

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
