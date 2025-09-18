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
 * We provide these components to clearly express what causes suspense at the same depth.
 * `<SuspenseInfiniteQuery/>` serves to make `useSuspenseInfiniteQuery` easier to use in jsx.
 * @see {@link https://suspensive.org/docs/react-query/SuspenseInfiniteQuery Suspensive Docs}
 * @example
 * ```tsx
 * import { SuspenseInfiniteQuery } from '@suspensive/react-query'
 *
 * // You can use infiniteQueryOptions as props.
 * <SuspenseInfiniteQuery {...infiniteQueryOptions()}>
 *   {({ data, fetchNextPage }) => {
 *     return <></>
 *   }}
 * </SuspenseInfiniteQuery>
 * ```
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
}: UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & {
  children: (query: UseSuspenseInfiniteQueryResult<TData, TError>) => ReactNode
}) => (
  <>
    {/* eslint-disable-next-line @suspensive/check-parent-suspense */}
    {children(useSuspenseInfiniteQuery(options))}
  </>
)
