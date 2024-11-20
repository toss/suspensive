import {
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query'
import type { OmitKeyof } from './utility-types'

export interface UseSuspenseInfiniteQueryResult<TData = unknown, TError = unknown>
  extends OmitKeyof<
    UseInfiniteQueryResult<TData, TError>,
    keyof Pick<UseInfiniteQueryResult<TData, TError>, 'isPlaceholderData'>
  > {
  data: InfiniteData<TData>
  status: 'success'
}

export type UseSuspenseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = OmitKeyof<
  UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
  'suspense' | 'useErrorBoundary' | 'enabled' | 'placeholderData'
>

/**
 * This hook is wrapping `useInfiniteQuery` of `@tanstack/react-query` v4 with default suspense option.
 * @see {@link https://suspensive.org/en/docs/react-query/useSuspenseInfiniteQuery Suspensive Docs}
 */
export function useSuspenseInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseSuspenseInfiniteQueryResult<TData, TError> {
  return useInfiniteQuery({
    ...options,
    enabled: true,
    suspense: true,
    useErrorBoundary: true,
  }) as UseSuspenseInfiniteQueryResult<TData, TError>
}
