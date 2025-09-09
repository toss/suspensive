import {
  type InfiniteData,
  type OmitKeyof,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type WithRequired,
  infiniteQueryOptions as original_infiniteQueryOptions,
} from '@tanstack/react-query'

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

/**
 * This feature is officially supported in \@tanstack/react-query@^4.41.0, You can proceed with the migration.
 * @deprecated Use `infiniteQueryOptions` from \@tanstack/react-query@^4.41.0
 * @example
 * ```diff
 * - import { infiniteQueryOptions } from '@suspensive/react-query'
 * + import { infiniteQueryOptions } from '@tanstack/react-query'
 * ```
 */
export const infiniteQueryOptions = original_infiniteQueryOptions
