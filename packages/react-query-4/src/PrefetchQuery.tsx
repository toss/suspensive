import { type FetchQueryOptions, type QueryKey } from '@tanstack/react-query'
import { usePrefetchQuery } from './usePrefetchQuery'

/**
 * A component that allows you to use usePrefetchQuery in JSX, avoiding the limitations of React hooks.
 *
 * @see {@link https://suspensive.org/en/docs/react-query/PrefetchQuery Suspensive Docs}
 */
export function PrefetchQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  usePrefetchQuery(options)
  return <></>
}
