import { type SuspenseQueriesOptions, type SuspenseQueriesResults, useSuspenseQueries } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export function SuspenseQueries<T extends any[], TCombinedResult = SuspenseQueriesResults<T>>({
  children,
  queries,
  combine,
}: {
  queries: readonly [...SuspenseQueriesOptions<T>]
  children: (queries: TCombinedResult) => ReactNode
  combine?: (result: SuspenseQueriesResults<T>) => TCombinedResult
}) {
  return <>{children(useSuspenseQueries({ queries, combine }))}</>
}
