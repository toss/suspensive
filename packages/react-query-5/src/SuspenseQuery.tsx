import {
  type DefaultError,
  type QueryKey,
  type UseSuspenseQueryOptions,
  type UseSuspenseQueryResult,
  useSuspenseQuery,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * We provide these components to clearly express what causes suspense at the same depth.
 * `<SuspenseQuery/>` serves to make `useSuspenseQuery` easier to use in jsx.
 * @see {@link https://suspensive.org/docs/react-query/SuspenseQuery Suspensive Docs}
 * @example
 * ```tsx
 * import { SuspenseQuery } from '@suspensive/react-query'
 *
 * // You can use queryOptions as props.
 * <SuspenseQuery {...queryOptions()}>
 *   {({ data }) => {
 *     return <></>
 *   }}
 * </SuspenseQuery>
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
