'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type SuspenseQueriesOptions as original_SuspenseQueriesOptions,
  type SuspenseQueriesResults as original_SuspenseQueriesResults,
  useSuspenseQueries as original_useSuspenseQueries,
} from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `SuspenseQueriesOptions` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import type { SuspenseQueriesOptions } from '@suspensive/react-query'
 * + import type { SuspenseQueriesOptions } from '@tanstack/react-query'
 * ```
 */
export type SuspenseQueriesOptions<
  T extends Array<any>,
  TResults extends Array<any> = [],
  TDepth extends ReadonlyArray<number> = [],
> = original_SuspenseQueriesOptions<T, TResults, TDepth>

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `SuspenseQueriesResults` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import type { SuspenseQueriesResults } from '@suspensive/react-query'
 * + import type { SuspenseQueriesResults } from '@tanstack/react-query'
 * ```
 */
export type SuspenseQueriesResults<
  T extends Array<any>,
  TResults extends Array<any> = [],
  TDepth extends ReadonlyArray<number> = [],
> = original_SuspenseQueriesResults<T, TResults, TDepth>

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `useSuspenseQueries` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import { useSuspenseQueries } from '@suspensive/react-query'
 * + import { useSuspenseQueries } from '@tanstack/react-query'
 * ```
 */
export const useSuspenseQueries = original_useSuspenseQueries
