'use client'

import {
  type UseSuspenseInfiniteQueryOptions as original_UseSuspenseInfiniteQueryOptions,
  type UseSuspenseInfiniteQueryResult as original_UseSuspenseInfiniteQueryResult,
  useSuspenseInfiniteQuery as original_useSuspenseInfiniteQuery,
} from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `UseSuspenseInfiniteQueryOptions` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import type { UseSuspenseInfiniteQueryOptions } from '@suspensive/react-query'
 * + import type { UseSuspenseInfiniteQueryOptions } from '@tanstack/react-query'
 * ```
 */
export type UseSuspenseInfiniteQueryOptions = original_UseSuspenseInfiniteQueryOptions

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `UseSuspenseInfiniteQueryResult` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import type { UseSuspenseInfiniteQueryResult } from '@suspensive/react-query'
 * + import type { UseSuspenseInfiniteQueryResult } from '@tanstack/react-query'
 * ```
 */
export type UseSuspenseInfiniteQueryResult = original_UseSuspenseInfiniteQueryResult

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `useSuspenseInfiniteQuery` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import { useSuspenseInfiniteQuery } from '@suspensive/react-query'
 * + import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
 * ```
 */
export const useSuspenseInfiniteQuery = original_useSuspenseInfiniteQuery
