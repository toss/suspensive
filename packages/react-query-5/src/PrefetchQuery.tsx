import { type DefaultError, type FetchQueryOptions, type QueryKey, usePrefetchQuery } from '@tanstack/react-query'

export function PrefetchQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  usePrefetchQuery(options)
  return <></>
}
