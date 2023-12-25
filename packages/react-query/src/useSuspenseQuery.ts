import {
  type QueryFunction,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
  parseQueryArgs,
  useQuery,
} from '@tanstack/react-query'

export interface BaseUseSuspenseQueryResult<TData = unknown>
  extends Omit<UseQueryResult<TData>, 'error' | 'isError' | 'isFetching'> {
  status: 'success' | 'loading'
}

export interface UseSuspenseQueryResultOnSuccess<TData> extends BaseUseSuspenseQueryResult<TData> {
  data: TData
  isLoading: false
  isSuccess: true
  status: 'success'
}
export interface UseSuspenseQueryResultOnLoading extends BaseUseSuspenseQueryResult {
  data: undefined
  isLoading: true
  isSuccess: false
  status: 'loading'
}

export type UseSuspenseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'suspense'>

/**
 * This hook wrapping useQuery of @tanstack/react-query with default suspense option. with this hook, you don't have to make unnecessary type narrowing
 * @see {@link https://suspensive.org/docs/react-query/useSuspenseQuery}
 */
// arg1: queryKey, arg2: queryFn, arg3: options
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled' | 'queryKey' | 'queryFn'>
): UseSuspenseQueryResultOnSuccess<TData>
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled' | 'queryKey' | 'queryFn'> & {
    enabled?: true
  }
): UseSuspenseQueryResultOnSuccess<TData>
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled' | 'queryKey' | 'queryFn'> & {
    enabled: false
  }
): UseSuspenseQueryResultOnLoading
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseSuspenseQueryResultOnSuccess<TData> | UseSuspenseQueryResultOnLoading

// arg1: queryKey, arg2: options
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled' | 'queryKey'>
): UseSuspenseQueryResultOnSuccess<TData>
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled' | 'queryKey'> & {
    enabled?: true
  }
): UseSuspenseQueryResultOnSuccess<TData>
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled' | 'queryKey'> & {
    enabled: false
  }
): UseSuspenseQueryResultOnLoading
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'>
): UseSuspenseQueryResultOnSuccess<TData> | UseSuspenseQueryResultOnLoading

// arg1: options
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled'>
): UseSuspenseQueryResultOnSuccess<TData>
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled'> & {
    enabled?: true
  }
): UseSuspenseQueryResultOnSuccess<TData>
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'enabled'> & {
    enabled: false
  }
): UseSuspenseQueryResultOnLoading
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseSuspenseQueryResultOnSuccess<TData> | UseSuspenseQueryResultOnLoading

// base useSuspenseQuery
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  arg1: TQueryKey | UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg2?:
    | QueryFunction<TQueryFnData, TQueryKey>
    | Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'>,
  arg3?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    ...parseQueryArgs(arg1, arg2, arg3),
    suspense: true,
  }) as BaseUseSuspenseQueryResult<TData>
}
