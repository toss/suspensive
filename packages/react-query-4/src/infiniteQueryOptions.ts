import type { InfiniteData, QueryKey, UseInfiniteQueryOptions } from '@tanstack/react-query'
import type { OmitKeyof, RequiredKeyof } from './utility-types'

type SelectedInfiniteOptions<
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
  >,
  'queryKey' | 'queryFn'
> & {
  select: (data: InfiniteData<TQueryFnData>) => InfiniteData<TData>
}

type UnSelectedInfiniteOptions<
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
  >,
  'queryKey' | 'queryFn'
> & {
  select?: undefined
}

/**
 * @experimental This is experimental feature.
 */
export function infiniteQueryOptions<
  TQueryFnData,
  TError = unknown,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: SelectedInfiniteOptions<TQueryFnData, TError, TData, TQueryKey>
): SelectedInfiniteOptions<TQueryFnData, TError, TData, TQueryKey>

/**
 * @experimental This is experimental feature.
 */
export function infiniteQueryOptions<
  TQueryFnData,
  TError = unknown,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UnSelectedInfiniteOptions<TQueryFnData, TError, TData, TQueryKey>
): UnSelectedInfiniteOptions<TQueryFnData, TError, TData, TQueryKey>

/**
 * @experimental This is experimental feature.
 */
export function infiniteQueryOptions(options: unknown) {
  return options
}
