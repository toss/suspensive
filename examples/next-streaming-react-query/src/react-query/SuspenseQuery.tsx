'use client'

import {
  type QueryKey,
  type UseSuspenseQueryOptions,
  type UseSuspenseQueryResult,
  useSuspenseQuery,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'

export const SuspenseQuery = <
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  children,
  ...options
}: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
  children: (result: UseSuspenseQueryResult<TData, TError>) => ReactNode
}) => children(useSuspenseQuery(options))
