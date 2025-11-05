'use client'

import {
  type UseSuspenseQueryOptions as original_UseSuspenseQueryOptions,
  type UseSuspenseQueryResult as original_UseSuspenseQueryResult,
  useSuspenseQuery as original_useSuspenseQuery,
} from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@^4.40.0, You can proceed with the migration.
 * @deprecated Use `UseSuspenseQueryOptions` from \@tanstack/react-query@^4.40.0
 * @example
 * ```diff
 * - import type { UseSuspenseQueryOptions } from '@suspensive/react-query'
 * + import type { UseSuspenseQueryOptions } from '@tanstack/react-query'
 * ```
 */
export type UseSuspenseQueryOptions = original_UseSuspenseQueryOptions

/**
 * This feature is officially supported in \@tanstack/react-query@^4.40.0, You can proceed with the migration.
 * @deprecated Use `UseSuspenseQueryResult` from \@tanstack/react-query@^4.40.0
 * @example
 * ```diff
 * - import type { UseSuspenseQueryResult } from '@suspensive/react-query'
 * + import type { UseSuspenseQueryResult } from '@tanstack/react-query'
 * ```
 */
export type UseSuspenseQueryResult = original_UseSuspenseQueryResult

/**
 * This feature is officially supported in \@tanstack/react-query@^4.40.0, You can proceed with the migration.
 * @deprecated Use `useSuspenseQuery` from \@tanstack/react-query@^4.40.0
 * @example
 * ```diff
 * - import { useSuspenseQuery } from '@suspensive/react-query'
 * + import { useSuspenseQuery } from '@tanstack/react-query'
 * ```
 */
export const useSuspenseQuery = original_useSuspenseQuery
