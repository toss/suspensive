'use client'

import {
  type OmitKeyof,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type WithRequired,
  useSuspenseInfiniteQuery as original_useSuspenseInfiniteQuery,
} from '@tanstack/react-query'

export type { UseSuspenseInfiniteQueryResult } from '@tanstack/react-query'

export type UseSuspenseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = WithRequired<
  OmitKeyof<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    'suspense' | 'useErrorBoundary' | 'enabled' | 'placeholderData' | 'networkMode' | 'initialData'
  >,
  'queryKey'
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
