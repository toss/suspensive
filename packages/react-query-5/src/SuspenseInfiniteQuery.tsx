import {
  type DefaultError,
  type InfiniteData,
  type QueryKey,
  type UseSuspenseInfiniteQueryOptions,
  type UseSuspenseInfiniteQueryResult,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * @experimental This is experimental feature.
 */
export const SuspenseInfiniteQuery = <
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>({
  children,
  ...options
}: UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey, TPageParam> & {
  children: (query: UseSuspenseInfiniteQueryResult<TData, TError>) => ReactNode
}) => <>{children(useSuspenseInfiniteQuery(options))}</>
