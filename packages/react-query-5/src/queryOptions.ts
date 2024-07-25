import type {
  DataTag,
  DefaultError,
  DefinedInitialDataOptions,
  QueryKey,
  UndefinedInitialDataOptions,
} from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `queryOptions` from \@tanstack/react-query@5
 */
export function queryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
): DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> & {
  queryKey: DataTag<TQueryKey, TQueryFnData>
}

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `queryOptions` from \@tanstack/react-query@5
 */
export function queryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
): UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> & {
  queryKey: DataTag<TQueryKey, TQueryFnData>
}

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `queryOptions` from \@tanstack/react-query@5
 */
export function queryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options:
    | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
) {
  return options
}
