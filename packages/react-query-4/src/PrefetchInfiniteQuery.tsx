'use client'

import {
  type FetchInfiniteQueryOptions,
  type QueryKey,
  type WithRequired,
  usePrefetchInfiniteQuery,
} from '@tanstack/react-query'

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
>(options: WithRequired<FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'>) {
  usePrefetchInfiniteQuery(options)
  return <></>
}
