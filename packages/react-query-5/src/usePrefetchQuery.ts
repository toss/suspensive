'use client'

import { usePrefetchQuery as original_usePrefetchQuery } from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `usePrefetchQuery` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import { usePrefetchQuery } from '@suspensive/react-query'
 * + import { usePrefetchQuery } from '@tanstack/react-query'
 * ```
 */
export const usePrefetchQuery = original_usePrefetchQuery
