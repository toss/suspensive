import { type FetchQueryOptions, type QueryKey, useQueryClient } from '@tanstack/react-query'

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
