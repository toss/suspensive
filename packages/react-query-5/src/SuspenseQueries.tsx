import { type SuspenseQueriesOptions, type SuspenseQueriesResults, useSuspenseQueries } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * @experimental This is experimental feature.
 */
export function SuspenseQueries<T extends any[]>({
  children,
  queries,
}: {
  queries: readonly [...SuspenseQueriesOptions<T>]
  children: (queries: SuspenseQueriesResults<T>) => ReactNode
}) {
  return <>{children(useSuspenseQueries({ queries }))}</>
}
