'use client'

import { type FetchInfiniteQueryOptions, type QueryKey } from '@tanstack/react-query'
import { usePrefetchInfiniteQuery } from './usePrefetchInfiniteQuery'

/**
 * A component that allows you to use `usePrefetchInfiniteQuery` in JSX, avoiding the limitations of React hooks.
 * @see {@link https://suspensive.org/docs/react-query/PrefetchInfiniteQuery Suspensive Docs}
 * @example
 * ```tsx
 * <PrefetchInfiniteQuery queryKey={['queryKey']} queryFn={queryFn} />
 * ```
 */
export function PrefetchInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  usePrefetchInfiniteQuery(options)
  return <></>
}
