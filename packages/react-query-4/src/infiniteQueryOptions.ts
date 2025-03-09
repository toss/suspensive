import type { InfiniteData, QueryKey, UseInfiniteQueryOptions } from '@tanstack/react-query'
import type { OmitKeyof, RequiredKeyof } from './utility-types'

export type SelectedInfiniteOptions<
  TQueryFnData,
  TError = unknown,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
> = RequiredKeyof<
  OmitKeyof<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
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
    | 'networkMode'
  >,
  'queryKey' | 'queryFn'
> & {
  select: (data: InfiniteData<TQueryFnData>) => InfiniteData<TData>
}

export type UnSelectedInfiniteOptions<
  TQueryFnData,
  TError = unknown,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
> = RequiredKeyof<
  OmitKeyof<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
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
    | 'networkMode'
  >,
  'queryKey' | 'queryFn'
> & {
  select?: undefined
}

export function infiniteQueryOptions<
  TQueryFnData,
  TError = unknown,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: SelectedInfiniteOptions<TQueryFnData, TError, TData, TQueryKey>
): SelectedInfiniteOptions<TQueryFnData, TError, TData, TQueryKey>

export function infiniteQueryOptions<
  TQueryFnData,
  TError = unknown,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UnSelectedInfiniteOptions<TQueryFnData, TError, TData, TQueryKey>
): UnSelectedInfiniteOptions<TQueryFnData, TError, TData, TQueryKey>

export function infiniteQueryOptions(options: unknown) {
  return options
}
