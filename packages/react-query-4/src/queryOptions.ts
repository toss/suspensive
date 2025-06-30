import { type QueryKey, type UseQueryOptions, queryOptions as original_queryOptions } from '@tanstack/react-query'
import type { OmitKeyof, RequiredKeyof } from './utility-types'

/**
 * @deprecated There is no `SelectedQueryOptions` in \@tanstack/react-query@^4.40.0.
 */
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
    | 'networkMode'
  >,
  'queryKey' | 'queryFn'
> & {
  select: (data: TQueryFnData) => TData
}

/**
 * @deprecated There is no `UnSelectedQueryOptions` in \@tanstack/react-query@^4.40.0.
 */
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
    | 'networkMode'
  >,
  'queryKey' | 'queryFn'
> & {
  select?: undefined
}

/**
 * This feature is officially supported in \@tanstack/react-query@^4.40.0, You can proceed with the migration.
 * @deprecated Use `queryOptions` from \@tanstack/react-query@^4.40.0
 * @example
 * ```diff
 * - import { queryOptions } from '@suspensive/react-query'
 * + import { queryOptions } from '@tanstack/react-query'
 * ```
 */
export const queryOptions = original_queryOptions
