import {
  InfiniteData,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query'

type BaseExtended<TData = unknown> =
  | { data: InfiniteData<TData>; status: 'success'; isLoading: false; isSuccess: true }
  | { data: undefined; status: 'loading'; isLoading: true; isSuccess: false }

export type BaseUseSuspenseInfiniteQueryResult<TExtended extends BaseExtended = BaseExtended> = Omit<
  UseInfiniteQueryResult,
  'data' | 'status' | 'error' | 'isLoading' | 'isLoadingError' | 'isError' | 'isRefetchError' | 'isFetching'
> &
  TExtended

export type UseSuspenseInfiniteQueryResultOnSuccess<TData> = BaseUseSuspenseInfiniteQueryResult<{
  data: InfiniteData<TData>
  isLoading: false
  isSuccess: true
  status: 'success'
}>
export type UseSuspenseInfiniteQueryResultOnLoading = BaseUseSuspenseInfiniteQueryResult<{
  data: undefined
  isLoading: true
  isSuccess: false
  status: 'loading'
}>

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
  }) as BaseUseSuspenseInfiniteQueryResult<BaseExtended<TData>>
}
