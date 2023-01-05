import {
  InfiniteData,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query'

export type BaseUseSuspenseInfiniteQueryResult<TData> = Omit<
  UseInfiniteQueryResult,
  'data' | 'status' | 'error' | 'isLoading' | 'isLoadingError' | 'isError' | 'isRefetchError' | 'isFetching'
> & { data: InfiniteData<TData>; isLoading: boolean; isSuccess: boolean; status: 'success' | 'loading' }

export type UseSuspenseInfiniteQueryResultOnSuccess<TData> = BaseUseSuspenseInfiniteQueryResult<TData> & {
  isLoading: false
  isSuccess: true
  status: 'success'
}
export type UseSuspenseInfiniteQueryResultOnLoading = BaseUseSuspenseInfiniteQueryResult<undefined> & {
  isLoading: true
  isSuccess: false
  status: 'loading'
}

export type UseSuspenseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Omit<
  UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
  'suspense' | 'queryKey' | 'queryFn'
>

export function useSuspenseInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled'>
): UseSuspenseInfiniteQueryResultOnSuccess<TData>
export function useSuspenseInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options: Omit<UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled'> & {
    enabled?: true
  }
): UseSuspenseInfiniteQueryResultOnSuccess<TData>
export function useSuspenseInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options: Omit<UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled'> & {
    enabled: false
  }
): UseSuspenseInfiniteQueryResultOnLoading
export function useSuspenseInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options: UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseSuspenseInfiniteQueryResultOnSuccess<TData> | UseSuspenseInfiniteQueryResultOnLoading
export function useSuspenseInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) {
  return useInfiniteQuery(queryKey, queryFn, {
    ...options,
    suspense: true,
  }) as BaseUseSuspenseInfiniteQueryResult<TData>
}
