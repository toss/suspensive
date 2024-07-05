import type { QueryKey } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { type UseSuspenseQueryOptions, type UseSuspenseQueryResult, useSuspenseQuery } from './useSuspenseQuery'

export const SuspenseQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  children,
  ...options
}: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
  children: (queryResult: UseSuspenseQueryResult<TData, TError>) => ReactNode
}) => <>{children(useSuspenseQuery(options))}</>
