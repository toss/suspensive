import type { InfiniteData, OmitKeyof, QueryKey, UseInfiniteQueryOptions, WithRequired } from '@tanstack/react-query'

/**
 * @deprecated There is no `SelectedInfiniteOptions` in \@tanstack/react-query@^4.40.0.
 */
export type SelectedInfiniteOptions<
  TQueryFnData,
  TError = unknown,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
> = WithRequired<
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

/**
 * @deprecated There is no `UnSelectedInfiniteOptions` in \@tanstack/react-query@^4.40.0.
 */
export type UnSelectedInfiniteOptions<
  TQueryFnData,
  TError = unknown,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
> = WithRequired<
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
