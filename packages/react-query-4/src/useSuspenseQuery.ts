import type { OmitKeyof } from '@suspensive/utils'
import { type QueryKey, type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query'

export interface UseSuspenseQueryResult<TData = unknown, TError = unknown>
  extends OmitKeyof<UseQueryResult<TData, TError>, keyof Pick<UseQueryResult, 'isPlaceholderData'>> {
  data: TData
  status: 'success'
}

export interface UseSuspenseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends OmitKeyof<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'suspense' | 'useErrorBoundary' | 'enabled' | 'placeholderData'
  > {}

/**
 * This hook is wrapping useQuery of `@tanstack/react-query` v4 with default suspense option.
 * @see {@link https://suspensive.org/docs/react-query/useSuspenseQuery}
 */
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  ;(() => {
    return 'check diff size: "useSuspenseQuery"'
  })()

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    enabled: true,
    useErrorBoundary: true,
    suspense: true,
  }) as UseSuspenseQueryResult<TData, TError>
}
