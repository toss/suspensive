'use client'

import { usePrefetchInfiniteQuery as original_usePrefetchInfiniteQuery } from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `usePrefetchInfiniteQuery` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import { usePrefetchInfiniteQuery } from '@suspensive/react-query'
 * + import { usePrefetchInfiniteQuery } from '@tanstack/react-query'
 * ```
 */
export const usePrefetchInfiniteQuery = original_usePrefetchInfiniteQuery
