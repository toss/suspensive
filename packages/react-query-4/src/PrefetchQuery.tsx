import { type FetchQueryOptions, type QueryKey } from '@tanstack/react-query'
import { usePrefetchQuery } from './usePrefetchQuery'

export function PrefetchQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  usePrefetchQuery(options)
  return <></>
}
