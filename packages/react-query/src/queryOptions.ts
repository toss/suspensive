import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'

/**
 * @experimental This is experimental feature.
 */
export function queryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: Required<Pick<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>>) {
  return options
}
