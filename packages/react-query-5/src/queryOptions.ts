import { queryOptions as original_queryOptions } from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `queryOptions` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import { queryOptions } from '@suspensive/react-query'
 * + import { queryOptions } from '@tanstack/react-query'
 * ```
 */
export const queryOptions = original_queryOptions

