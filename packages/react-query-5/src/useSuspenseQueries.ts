import { useSuspenseQueries as original_useSuspenseQueries } from '@tanstack/react-query'

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
