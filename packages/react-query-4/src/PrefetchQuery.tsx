'use client'

import { type FetchQueryOptions, type QueryKey, type WithRequired, usePrefetchQuery } from '@tanstack/react-query'

/**
 * A component that allows you to use usePrefetchQuery in JSX, avoiding the limitations of React hooks.
 * @see {@link https://suspensive.org/docs/react-query/PrefetchQuery Suspensive Docs}
 * @example
 * ```tsx
 * <PrefetchQuery queryKey={['queryKey']} queryFn={queryFn} />
 * ```
 */
export function PrefetchQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: WithRequired<FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'>) {
  usePrefetchQuery(options)
  return <></>
}
