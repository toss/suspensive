import {
  type DefaultError,
  type FetchInfiniteQueryOptions,
  type QueryKey,
  usePrefetchInfiniteQuery,
} from '@tanstack/react-query'

export function PrefetchInfiniteQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(options: FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>) {
  usePrefetchInfiniteQuery(options)
  return <></>
}
