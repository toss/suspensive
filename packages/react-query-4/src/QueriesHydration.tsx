import {
  Hydrate,
  type HydrateProps,
  type OmitKeyof,
  QueryClient,
  type QueryKey,
  type QueryOptions,
  type UseInfiniteQueryOptions,
  type WithRequired,
  dehydrate,
  hashQueryKey,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ClientOnly } from './components/ClientOnly'

type HydrationQuery = (
  | WithRequired<QueryOptions<any, any, any, any>, 'queryKey'>
  | WithRequired<UseInfiniteQueryOptions<any, any, any, any, any>, 'queryKey'>
) & { queryKey: QueryKey }

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
  timeout,
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
  queries: HydrationQuery[]
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
   * When not set, no timeout is applied.
   */
  timeout?: number
} & OmitKeyof<HydrateProps, 'state'>) {
  const timeoutController =
    timeout != null && timeout >= 0
      ? createTimeoutController(timeout, `QueriesHydration: timeout after ${timeout} ms`)
      : undefined
  try {
    const queriesPromise = Promise.all(
      queries.map((query) =>
        'getNextPageParam' in query ? queryClient.fetchInfiniteQuery(query) : queryClient.fetchQuery(query)
      )
    )
    await (timeoutController != null ? Promise.race([queriesPromise, timeoutController.promise]) : queriesPromise)
  } catch (error) {
    if (timeoutController?.isTimeoutError(error)) {
      const timeoutQueryHashes = new Set(queries.map((query) => hashQueryKey(normalizeQueryKey(query.queryKey))))

      void queryClient.cancelQueries({
        predicate: (query) => timeoutQueryHashes.has(query.queryHash),
      })
    }
    if (skipSsrOnError) {
      return (
        <ClientOnly fallback={skipSsrOnError === true ? undefined : skipSsrOnError.fallback}>{children}</ClientOnly>
      )
    }
  } finally {
    timeoutController?.clear()
  }
  return (
    <Hydrate {...props} state={dehydrate(queryClient)}>
      {children}
    </Hydrate>
  )
}

const createTimeoutController = (ms: number, errorMessage: string) => {
  let timerId: ReturnType<typeof setTimeout> | undefined
  const timeoutError = new Error(errorMessage)
  return {
    promise: new Promise<never>((_, reject) => {
      timerId = setTimeout(() => reject(timeoutError), ms)
    }),
    clear: () => timerId != null && clearTimeout(timerId),
    isTimeoutError: (error: unknown) => error === timeoutError,
  }
}

const normalizeQueryKey = (queryKey: unknown): QueryKey => (Array.isArray(queryKey) ? queryKey : [queryKey])
