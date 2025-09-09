import {
  type OmitKeyof,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseSuspenseInfiniteQueryResult as original_UseSuspenseInfiniteQueryResult,
  useSuspenseInfiniteQuery as original_useSuspenseInfiniteQuery,
} from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@^4.41.0, You can proceed with the migration.
 * @deprecated Use `UseSuspenseInfiniteQueryResult` from \@tanstack/react-query@^4.41.0
 * @example
 * ```diff
 * - import { UseSuspenseInfiniteQueryResult } from '@suspensive/react-query'
 * + import { UseSuspenseInfiniteQueryResult } from '@tanstack/react-query'
 * ```
 */
export type UseSuspenseInfiniteQueryResult = original_UseSuspenseInfiniteQueryResult

export type UseSuspenseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = OmitKeyof<
  UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
  'suspense' | 'useErrorBoundary' | 'enabled' | 'placeholderData' | 'networkMode'
>

/**
 * This feature is officially supported in \@tanstack/react-query@^4.41.0, You can proceed with the migration.
 * @deprecated Use `useSuspenseInfiniteQuery` from \@tanstack/react-query@^4.41.0
 * @example
 * ```diff
 * - import { useSuspenseInfiniteQuery } from '@suspensive/react-query'
 * + import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
 * ```
 */
export const useSuspenseInfiniteQuery = original_useSuspenseInfiniteQuery
