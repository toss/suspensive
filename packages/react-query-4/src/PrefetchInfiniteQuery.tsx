import { type FetchInfiniteQueryOptions, type QueryKey } from '@tanstack/react-query'
import { usePrefetchInfiniteQuery } from './usePrefetchInfiniteQuery'

export function PrefetchInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  usePrefetchInfiniteQuery(options)
  return <></>
}
