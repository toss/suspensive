import type { QueryKey } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import {
  type UseSuspenseInfiniteQueryOptions,
  type UseSuspenseInfiniteQueryResult,
  useSuspenseInfiniteQuery,
} from './useSuspenseInfiniteQuery'

export const SuspenseInfiniteQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  children,
  ...options
}: UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
  children: (query: UseSuspenseInfiniteQueryResult<TData, TError>) => ReactNode
}) => <>{children(useSuspenseInfiniteQuery(options))}</>
