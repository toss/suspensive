// TODO: remove this eslint
/* eslint-disable @typescript-eslint/naming-convention */
import {
  type QueryFunction,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
  useQueries,
} from '@tanstack/react-query'
import type { UseSuspenseQueryOptions, UseSuspenseQueryResult } from './useSuspenseQuery'

// Avoid TS depth-limit error in case of large array literal
type MAXIMUM_DEPTH = 20

interface ToInferOptions<TQueryFnData, TQueryKey extends QueryKey> {
  queryFn?: QueryFunction<TQueryFnData, TQueryKey>
}

interface ToInferWithSelectOptions<TQueryFnData, TData, TQueryKey extends QueryKey>
  extends ToInferOptions<TQueryFnData, TQueryKey> {
  select: (data: unknown) => TData
}

type GetSuspenseOptions<T> =
  // enabled: false
  T extends ToInferWithSelectOptions<infer TQueryFnData, infer TData, infer TQueryKey>
    ? UseSuspenseQueryOptions<TQueryFnData, unknown, TData, TQueryKey>
    : T extends ToInferOptions<infer TQueryFnData, infer TQueryKey>
      ? UseSuspenseQueryOptions<TQueryFnData, unknown, TQueryFnData, TQueryKey>
      : UseSuspenseQueryOptions

export type SuspenseQueriesOptions<
  T extends unknown[],
  TResult extends unknown[] = [],
  TDepth extends ReadonlyArray<number> = [],
> = TDepth['length'] extends MAXIMUM_DEPTH
  ? UseSuspenseQueryOptions[]
  : T extends []
    ? []
    : T extends [infer Head]
      ? [...TResult, GetSuspenseOptions<Head>]
      : T extends [infer Head, ...infer Tail]
        ? SuspenseQueriesOptions<[...Tail], [...TResult, GetSuspenseOptions<Head>], [...TDepth, 1]>
        : unknown[] extends T
          ? T
          : T extends UseSuspenseQueryOptions<infer TQueryFnData, unknown, infer TData, infer TQueryKey>[]
            ? UseSuspenseQueryOptions<TQueryFnData, unknown, TData, TQueryKey>[]
            : UseSuspenseQueryOptions[]

// results
type GetSuspenseResult<T> = T extends { queryFnData: any; data: infer TData }
  ? UseSuspenseQueryResult<TData>
  : T extends { queryFnData: infer TQueryFnData }
    ? UseSuspenseQueryResult<TQueryFnData>
    : T extends { data: infer TData }
      ? UseSuspenseQueryResult<TData>
      : T extends [any, infer TData]
        ? UseSuspenseQueryResult<TData>
        : T extends [infer TQueryFnData]
          ? UseSuspenseQueryResult<TQueryFnData>
          : T extends [infer TQueryFnData]
            ? UseSuspenseQueryResult<TQueryFnData>
            : T extends ToInferWithSelectOptions<unknown, infer TData, QueryKey>
              ? UseSuspenseQueryResult<TData>
              : T extends ToInferOptions<infer TQueryFnData, QueryKey>
                ? UseSuspenseQueryResult<TQueryFnData>
                : UseSuspenseQueryResult<unknown>

export type SuspenseQueriesResults<
  T extends any[],
  TResult extends any[] = [],
  TDepth extends ReadonlyArray<number> = [],
> = TDepth['length'] extends MAXIMUM_DEPTH
  ? UseQueryResult[]
  : T extends []
    ? []
    : T extends [infer Head]
      ? [...TResult, GetSuspenseResult<Head>]
      : T extends [infer Head, ...infer Tail]
        ? SuspenseQueriesResults<[...Tail], [...TResult, GetSuspenseResult<Head>], [...TDepth, 1]>
        : T extends UseSuspenseQueryOptions<infer TQueryFnData, unknown, infer TData, QueryKey>[]
          ? UseSuspenseQueryResult<unknown extends TData ? TQueryFnData : TData>[]
          : UseSuspenseQueryResult<unknown>[]

type UseSuspenseQueries = <T extends any[]>(arg: {
  queries: readonly [...SuspenseQueriesOptions<T>]
  context?: UseQueryOptions['context']
}) => SuspenseQueriesResults<T>
export const useSuspenseQueries: UseSuspenseQueries = <T extends any[]>({
  queries,
  context,
}: {
  queries: readonly [...SuspenseQueriesOptions<T>]
  context?: UseQueryOptions['context']
}) =>
  useQueries({
    queries: queries.map((query) => ({ ...query, suspense: true })),
    context,
  }) as SuspenseQueriesResults<T>
