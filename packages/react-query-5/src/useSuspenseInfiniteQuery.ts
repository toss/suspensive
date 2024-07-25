import { useSuspenseInfiniteQuery as original_useSuspenseInfiniteQuery } from '@tanstack/react-query'

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
