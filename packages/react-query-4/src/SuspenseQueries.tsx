import type { ReactNode } from 'react'
import { type SuspenseQueriesOptions, type SuspenseQueriesResults, useSuspenseQueries } from './useSuspenseQueries'

export function SuspenseQueries<T extends any[]>({
  children,
  queries,
}: {
  queries: readonly [...SuspenseQueriesOptions<T>]
  children: (queries: SuspenseQueriesResults<T>) => ReactNode
}) {
  return <>{children(useSuspenseQueries({ queries }))}</>
}
