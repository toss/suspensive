import {
  Hydrate,
  type HydrateProps,
  type OmitKeyof,
  QueryClient,
  type QueryOptions,
  type UseInfiniteQueryOptions,
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
 * const userQueryOptions = (userId: string) => queryOptions({
 *   queryKey: ['user', userId],
 *   queryFn: () => fetchUser(userId)
 * })
 *
 * const postsQueryOptions = () => queryOptions({
 *   queryKey: ['posts'],
 *   queryFn: () => fetchPosts()
 * })
 *
 * export default function Page({ userId }: { userId: string }) {
 *   return (
 *     <>
 *       <Suspense fallback={<div>Loading user...</div>}>
 *         <QueriesHydration queries={[userQueryOptions(userId)]}>
 *           <UserProfile />
 *         </QueriesHydration>
 *       </Suspense>
 *
 *       <Suspense fallback={<div>Loading posts...</div>}>
 *         <QueriesHydration queries={[postsQueryOptions()]}>
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
 *     queries={[userQueryOptions(userId)]}
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
  queryClient = new QueryClient(),
  skipSsrOnError = true,
  timeout = 100_000,
  ...props
}: {
  /**
   * The QueryClient instance to use for fetching queries.
   */
  queryClient?: QueryClient
  /**
   * An array of query options or infinite query options to be fetched on the server. Each query must include a `queryKey`.
   * You can mix regular queries and infinite queries in the same array.
   */
  queries: (
    | WithRequired<QueryOptions<any, any, any, any>, 'queryKey'>
    | WithRequired<UseInfiniteQueryOptions<any, any, any, any, any>, 'queryKey'>
  )[]
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
  /**
   * The timeout in milliseconds for the query.
   * If the query takes longer than the timeout, it will be considered as an error.
   * Defaults to 100_000.
   */
  timeout?: number
} & OmitKeyof<HydrateProps, 'state'>) {
  try {
    const queriesPromises = Promise.all(
      queries.map((query) =>
        'getNextPageParam' in query ? queryClient.fetchInfiniteQuery(query) : queryClient.fetchQuery(query)
      )
    )
    await Promise.race([queriesPromises, delayedError(timeout)])
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

const delayedError = (timeout: number) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
