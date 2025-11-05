import {
  HydrationBoundary,
  type HydrationBoundaryProps,
  type OmitKeyof,
  QueryClient,
  type QueryOptions,
  type WithRequired,
  dehydrate,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ClientOnly } from './components/ClientOnly'

/**
 * A server component that fetches multiple queries on the server and hydrates them to the client.
 *
 * @experimental This component is experimental and may be changed or removed in the future.
 *
 * @description
 * QueriesHydrationBoundary is designed for React Server Components (RSC).
 * It pre-fetches multiple queries on the server side and automatically hydrates
 * the data to the client, enabling seamless data synchronization between server and client.
 *
 * When errors occur during server-side fetching, the component gracefully falls back
 * to client-side rendering, ensuring your application remains resilient.
 *
 * @example
 * ```tsx
 * // app/page.tsx (Server Component)
 * import { Suspense } from 'react'
 * import { QueriesHydrationBoundary } from '@suspensive/react-query'
 * import { queryOptions } from '@tanstack/react-query'
 *
 * const userQuery = queryOptions({
 *   queryKey: ['user', id],
 *   queryFn: () => fetchUser(id)
 * })
 *
 * const postsQuery = queryOptions({
 *   queryKey: ['posts'],
 *   queryFn: () => fetchPosts()
 * })
 *
 * export default function Page() {
 *   return (
 *     <>
 *       <Suspense fallback={<div>Loading user...</div>}>
 *         <QueriesHydrationBoundary queries={[userQuery]}>
 *           <UserProfile />
 *         </QueriesHydrationBoundary>
 *       </Suspense>
 *
 *       <Suspense fallback={<div>Loading posts...</div>}>
 *         <QueriesHydrationBoundary queries={[postsQuery]}>
 *           <PostsList />
 *         </QueriesHydrationBoundary>
 *       </Suspense>
 *     </>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom error fallback
 * <Suspense fallback={<div>Loading user...</div>}>
 *   <QueriesHydrationBoundary
 *     queries={[userQuery]}
 *     skipSSROnError={{ fallback: <div>Fetching on client...</div> }}
 *   >
 *     <UserProfile />
 *   </QueriesHydrationBoundary>
 * </Suspense>
 * ```
 *
 * @see {@link https://suspensive.org/docs/react-query/QueriesHydrationBoundary Documentation}
 */
export async function QueriesHydrationBoundary({
  queries,
  children,
  queryClient = new QueryClient(),
  skipSSROnError = true,
  ...props
}: {
  /**
   * An array of query options to be fetched on the server. Each query must include a `queryKey`.
   */
  queries: WithRequired<QueryOptions<any, any, any, any>, 'queryKey'>[]
  /**
   * Controls error handling behavior:
   * - `true` (default): Skips SSR and falls back to client-side rendering when server fetch fails
   * - `false`: Proceeds with SSR without hydration (retry fetching on client component server rendering)
   * - `{ fallback: ReactNode }`: Skips SSR with custom fallback UI during client-side rendering
   */
  skipSSROnError?:
    | boolean
    | {
        fallback: ReactNode
      }
} & OmitKeyof<HydrationBoundaryProps, 'state'>) {
  try {
    await Promise.all(queries.map((query) => queryClient.ensureQueryData(query)))
  } catch {
    if (skipSSROnError) {
      return (
        <ClientOnly fallback={skipSSROnError === true ? undefined : skipSSROnError.fallback}>{children}</ClientOnly>
      )
    }
  }
  return (
    <HydrationBoundary {...props} state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
