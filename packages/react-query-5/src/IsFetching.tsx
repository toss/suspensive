import { type QueryFilters, useIsFetching } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * @experimental This is an experimental feature.
 */
export const IsFetching = ({
  children,
  ...filter
}: QueryFilters & {
  children: (isFetching: ReturnType<typeof useIsFetching>) => ReactNode
}) => <>{children(useIsFetching(filter))}</>
