import { useSuspenseQuery as original_useSuspenseQuery } from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `useSuspenseQuery` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import { useSuspenseQuery } from '@suspensive/react-query'
 * + import { useSuspenseQuery } from '@tanstack/react-query'
 * ```
 */
export const useSuspenseQuery = original_useSuspenseQuery
