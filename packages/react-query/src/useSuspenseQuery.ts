import {
  type QueryFunction,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
  parseQueryArgs,
  useQuery,
} from '@tanstack/react-query'

export interface UseSuspenseQueryResult<TData = unknown, TError = unknown>
  extends Omit<UseQueryResult<TData, TError>, keyof Pick<UseQueryResult, 'isPlaceholderData'>> {
  data: TData
  status: 'success'
}

export interface UseSuspenseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'suspense' | 'useErrorBoundary' | 'enabled' | 'placeholderData'
  > {}

/**
 * This hook is wrapping useQuery of `@tanstack/react-query` v4 with default suspense option.
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
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseSuspenseQueryResult<TData, TError>
// arg1: queryKey, arg2: options
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'>
): UseSuspenseQueryResult<TData, TError>
// arg1: options
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>): UseSuspenseQueryResult<TData, TError>
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
  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...parseQueryArgs(arg1, arg2, arg3),
    enabled: true,
    useErrorBoundary: true,
    suspense: true,
  }) as UseSuspenseQueryResult<TData, TError>
}
