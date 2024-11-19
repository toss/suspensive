import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import type { OmitKeyof, RequiredKeyof } from './utility-types'

export type SelectedQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = RequiredKeyof<
  OmitKeyof<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    | 'getNextPageParam'
    | 'getPreviousPageParam'
    | 'queryKeyHashFn'
    | '_defaulted'
    | 'behavior'
    | 'structuralSharing'
    | 'isDataEqual'
    | 'onSuccess'
    | 'onError'
    | 'onSettled'
    | 'enabled'
    | 'refetchInterval'
    | 'initialData'
  >,
  'queryKey' | 'queryFn'
> & {
  select: (data: TQueryFnData) => TData
}

export type UnSelectedQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = RequiredKeyof<
  OmitKeyof<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    | 'getNextPageParam'
    | 'getPreviousPageParam'
    | 'queryKeyHashFn'
    | '_defaulted'
    | 'behavior'
    | 'structuralSharing'
    | 'isDataEqual'
    | 'onSuccess'
    | 'onError'
    | 'onSettled'
    | 'enabled'
    | 'refetchInterval'
    | 'initialData'
  >,
  'queryKey' | 'queryFn'
> & {
  select?: undefined
}

/**
 * Creates a reusable query options object that can be used across different query hooks.
 * Provides better type inference and easier query key management.
 *
 * @see {@link https://suspensive.org/en/docs/react-query/queryOptions Suspensive Docs}
 */
export function queryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: SelectedQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): SelectedQueryOptions<TQueryFnData, TError, TData, TQueryKey>

export function queryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UnSelectedQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UnSelectedQueryOptions<TQueryFnData, TError, TData, TQueryKey>

export function queryOptions(options: unknown) {
  return options
}
