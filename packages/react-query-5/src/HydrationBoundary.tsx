import {
  HydrationBoundary as original_HydrationBoundary,
  type HydrationBoundaryProps as original_HydrationBoundaryProps,
} from '@tanstack/react-query'

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `HydrationBoundaryProps` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import type { HydrationBoundaryProps } from '@suspensive/react-query'
 * + import type { HydrationBoundaryProps } from '@tanstack/react-query'
 * ```
 */
export type HydrationBoundaryProps = original_HydrationBoundaryProps

/**
 * This feature is officially supported in \@tanstack/react-query@5, You can proceed with the migration.
 * @deprecated Use `HydrationBoundary` from \@tanstack/react-query@5
 * @example
 * ```diff
 * - import { HydrationBoundary } from '@suspensive/react-query'
 * + import { HydrationBoundary } from '@tanstack/react-query'
 * ```
 */
export const HydrationBoundary = original_HydrationBoundary
