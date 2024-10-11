import type { QueryKey } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import {
  type UseSuspenseInfiniteQueryOptions,
  type UseSuspenseInfiniteQueryResult,
  useSuspenseInfiniteQuery,
} from './useSuspenseInfiniteQuery'

/**
 * We provide these components to clearly express what causes suspense at the same depth.
 * `<SuspenseInfiniteQuery/>` serves to make `useSuspenseInfiniteQuery` easier to use in jsx.
 *
 * @see {@link https://suspensive.org/en/docs/react-query/SuspenseInfiniteQuery Suspensive Docs}
 *
 * @example
 * ```tsx
 * import { SuspenseInfiniteQuery } from '@suspensive/react-query'
 *
 * <SuspenseInfiniteQuery {...postsInfiniteQueryOptions(userId)}>
 *   {({ data, fetchNextPage }) => (
 *     <>
 *       {data.pages.map((post) => (
 *         <PostListItem {...post} />
 *       ))}
 *       <button
 *         type="button"
 *         onClick={() => {
 *           fetchNextPage()
 *         }}
 *       >
 *         Load More
 *       </button>
 *     </>
 *   )}
 * </SuspenseInfiniteQuery>
 * ```
 */
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
