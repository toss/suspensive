'use client'
import { type MutationFilters, useIsMutating } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * Renders the current mutating count for mutations that match the given filters.
 * @experimental This is an experimental feature.
 */
export const IsMutating = ({
  children,
  ...filter
}: MutationFilters & {
  children: (isMutating: ReturnType<typeof useIsMutating>) => ReactNode
}) => <>{children(useIsMutating(filter))}</>
