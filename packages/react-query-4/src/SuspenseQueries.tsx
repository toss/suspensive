import type { ReactNode } from 'react'
import { type SuspenseQueriesOptions, type SuspenseQueriesResults, useSuspenseQueries } from './useSuspenseQueries'

/**
 * We provide these components to clearly express what causes suspense at the same depth.
 * `<SuspenseQueries/>` serves to make `useSuspenseQueries` easier to use in jsx.
 * @see {@link https://suspensive.org/docs/react-query/SuspenseQueries Suspensive Docs}
 * @example
 * ```tsx
 * import { SuspenseQueries } from '@suspensive/react-query'
 *
 * <SuspenseQueries queries={[firstQueryOptions(), secondQueryOptions()]}>
 *   {([{ data: firstQueryData }, { data: secondQueryData }]) => {
 *     return <></>
 *   }}
 * </SuspenseQueries>
 * ```
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
