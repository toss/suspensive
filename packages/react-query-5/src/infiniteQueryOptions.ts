import { infiniteQueryOptions as original_infiniteQueryOptions } from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `infiniteQueryOptions` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import { infiniteQueryOptions } from '@suspensive/react-query'
 * + import { infiniteQueryOptions } from '@tanstack/react-query'
 * ```
 */
export const infiniteQueryOptions = original_infiniteQueryOptions
