import {
  type DefaultError,
  type QueryKey,
  type UseSuspenseQueryOptions,
  type UseSuspenseQueryResult,
  useSuspenseQuery,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * @experimental This is experimental feature.
 */
export const SuspenseQuery = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  children,
  ...options
}: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
  children: (queryResult: UseSuspenseQueryResult<TData, TError>) => ReactNode
}) => <>{children(useSuspenseQuery(options))}</>
