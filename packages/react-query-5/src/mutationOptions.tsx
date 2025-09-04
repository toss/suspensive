import { mutationOptions as original_mutationOptions } from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `mutationOptions` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import { mutationOptions } from '@suspensive/react-query'
 * + import { mutationOptions } from '@tanstack/react-query'
 * ```
 */
export const mutationOptions = original_mutationOptions
