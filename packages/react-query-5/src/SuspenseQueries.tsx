import { type SuspenseQueriesOptions, type SuspenseQueriesResults, useSuspenseQueries } from '@tanstack/react-query'
import type { ReactNode } from 'react'

/**
 * We provide these components to clearly express what causes suspense at the same depth.
 * `<SuspenseQueries/>` serves to make `useSuspenseQueries` easier to use in jsx.
 *
 * @see {@link https://suspensive.org/en/docs/react-query/SuspenseQueries Suspensive Docs}
 *
 * @example
 * ```tsx
 * import { SuspenseQueries } from '@suspensive/react-query'
 *
 * <SuspenseQueries queries={[userQueryOptions(userId), postsQueryOptions(userId)]}>
 *   {([{ data: user }, { data: posts }]) => (
 *     <>
 *       {<UserProfile {...user} />}
 *       {posts.map((post) => (
 *         <PostListItem key={post.id} {...post} />
 *       ))}
 *     </>
 *   )}
 * </SuspenseQueries>
 * ```
 */
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
