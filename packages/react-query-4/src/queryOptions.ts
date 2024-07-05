import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import type { OmitKeyof, RequiredKeyof } from './utility-types'

type SelectedQueryOptions<
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

type UnSelectedQueryOptions<
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
export function queryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options:
    | SelectedQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    | UnSelectedQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) {
  return options
}
