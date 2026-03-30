'use client'
import { type QueryFilters, useIsFetching } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * Renders the current fetching count for queries that match the given filters.
 * @experimental This is an experimental feature.
 */
export const IsFetching = ({
  children,
  ...filter
}: QueryFilters & { children: (isFetching: ReturnType<typeof useIsFetching>) => ReactNode }) => (
  <>{children(useIsFetching(filter))}</>
)
