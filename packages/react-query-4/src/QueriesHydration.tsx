import {
  Hydrate,
  type HydrateProps,
  type OmitKeyof,
  type QueryClient,
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
 * QueriesHydration is designed for React Server Components (RSC).
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
 * import { QueriesHydration } from '@suspensive/react-query'
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
 *         <QueriesHydration queries={[userQuery]}>
 *           <UserProfile />
 *         </QueriesHydration>
 *       </Suspense>
 *
 *       <Suspense fallback={<div>Loading posts...</div>}>
 *         <QueriesHydration queries={[postsQuery]}>
 *           <PostsList />
 *         </QueriesHydration>
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
 *   <QueriesHydration
 *     queries={[userQuery]}
 *     skipSsrOnError={{ fallback: <div>Fetching on client...</div> }}
 *   >
 *     <UserProfile />
 *   </QueriesHydration>
 * </Suspense>
 * ```
 *
 * @see {@link https://suspensive.org/docs/react-query/QueriesHydration Documentation}
 */
export async function QueriesHydration({
  queries,
  children,
  queryClient,
  skipSsrOnError = true,
  ...props
}: {
  /**
   * The QueryClient instance to use for fetching queries.
   */
  queryClient: QueryClient
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
  skipSsrOnError?:
    | boolean
    | {
        fallback: ReactNode
      }
} & OmitKeyof<HydrateProps, 'state'>) {
  try {
    await Promise.all(queries.map((query) => queryClient.ensureQueryData(query)))
  } catch {
    if (skipSsrOnError) {
      return (
        <ClientOnly fallback={skipSsrOnError === true ? undefined : skipSsrOnError.fallback}>{children}</ClientOnly>
      )
    }
  }
  return (
    <Hydrate {...props} state={dehydrate(queryClient)}>
      {children}
    </Hydrate>
  )
}
