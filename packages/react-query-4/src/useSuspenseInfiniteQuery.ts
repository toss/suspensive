import {
  type InfiniteData,
  type Query,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query'
import type { OmitKeyof } from './utility-types'

/**
 * @experimental This is experimental feature.
 */
export type RefetchOption<TQueryFnData, TError, TQueryData, TQueryKey extends QueryKey> =
  | boolean
  | 'always'
  | ((query: Query<TQueryFnData, TError, TQueryData, TQueryKey>) => boolean | 'always')

export interface UseSuspenseInfiniteQueryResult<TData = unknown, TError = unknown>
  extends OmitKeyof<
    UseInfiniteQueryResult<TData, TError>,
    keyof Pick<UseInfiniteQueryResult<TData, TError>, 'isPlaceholderData'>
  > {
  data: InfiniteData<TData>
  status: 'success'
}

export interface UseSuspenseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends OmitKeyof<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
    | 'suspense'
    | 'useErrorBoundary'
    | 'enabled'
    | 'placeholderData'
    | 'refetchOnMount'
    | 'refetchOnReconnect'
    | 'refetchOnWindowFocus'
  > {
  refetchOnMount?: RefetchOption<TQueryFnData, TError, TData, TQueryKey>
  refetchOnReconnect?: RefetchOption<TQueryFnData, TError, TData, TQueryKey>
  refetchOnWindowFocus?: RefetchOption<TQueryFnData, TError, TData, TQueryKey>
}

/**
 * This hook is wrapping useInfiniteQuery of `@tanstack/react-query` v4 with default suspense option.
 * @see {@link https://suspensive.org/docs/react-query/useSuspenseInfiniteQuery}
 * @experimental This is experimental feature.
 */
export function useSuspenseInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseSuspenseInfiniteQueryResult<TData, TError> {
  const { refetchOnMount, refetchOnReconnect, refetchOnWindowFocus, ...restOptions } = options
  return useInfiniteQuery({
    ...restOptions,
    enabled: true,
    suspense: true,
    useErrorBoundary: true,
    refetchOnMount: refetchOnMount as UseInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >['refetchOnMount'],
    refetchOnReconnect: refetchOnReconnect as UseInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >['refetchOnReconnect'],
    refetchOnWindowFocus: refetchOnWindowFocus as UseInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >['refetchOnWindowFocus'],
  }) as UseSuspenseInfiniteQueryResult<TData, TError>
}
