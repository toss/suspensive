import type {
  InfiniteData,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query'
import { parseQueryArgs, useInfiniteQuery } from '@tanstack/react-query'

export interface UseSuspenseInfiniteQueryResult<TData = unknown, TError = unknown>
  extends Omit<
    UseInfiniteQueryResult<TData, TError>,
    keyof Pick<UseInfiniteQueryResult<TData, TError>, 'isPlaceholderData'>
  > {
  data: InfiniteData<TData>
  status: 'success'
}

export interface UseSuspenseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    'suspense' | 'useErrorBoundary' | 'enabled' | 'placeholderData'
  > {}

/**
 * This hook is wrapping useInfiniteQuery of @tanstack/react-query v4 with default suspense option.
 * @see {@link https://suspensive.org/docs/react-query/useSuspenseInfiniteQuery}
 */
// arg1: queryKey, arg2: queryFn, arg3: options
export function useSuspenseInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseSuspenseInfiniteQueryResult<TData, TError>
// arg1: queryKey, arg2: options
export function useSuspenseInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options: Omit<UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'>
): UseSuspenseInfiniteQueryResult<TData, TError>
// arg1: options
export function useSuspenseInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseSuspenseInfiniteQueryResult<TData, TError>
export function useSuspenseInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  arg1: TQueryKey | UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg2?:
    | QueryFunction<TQueryFnData, TQueryKey>
    | Omit<UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'>,
  arg3?: Omit<UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseSuspenseInfiniteQueryResult<TData, TError> {
  return useInfiniteQuery({
    ...parseQueryArgs(arg1, arg2, arg3),
    enabled: true,
    suspense: true,
    useErrorBoundary: true,
  }) as UseSuspenseInfiniteQueryResult<TData, TError>
}
