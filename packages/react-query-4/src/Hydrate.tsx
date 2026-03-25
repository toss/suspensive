import {
  type HydrateProps,
  type OmitKeyof,
  QueryClient,
  type QueryOptions,
  Hydrate as TanstackHydrate,
  type UseInfiniteQueryOptions,
  type WithRequired,
  dehydrate,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ClientOnly } from './components/ClientOnly'

/**
 * A server component that fetches multiple queries on the server and hydrates them to the client.
 *
 * @description
 * Hydrate is designed for React Server Components (RSC).
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
 * import { Hydrate } from '@suspensive/react-query'
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
 *         <Hydrate queries={[userQueryOptions(userId)]}>
 *           <UserProfile />
 *         </Hydrate>
 *       </Suspense>
 *
 *       <Suspense fallback={<div>Loading posts...</div>}>
 *         <Hydrate queries={[postsQueryOptions()]}>
 *           <PostsList />
 *         </Hydrate>
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
 *   <Hydrate
 *     queries={[userQueryOptions(userId)]}
 *     skipSsrOnError={{ fallback: <div>Fetching on client...</div> }}
 *   >
 *     <UserProfile />
 *   </Hydrate>
 * </Suspense>
 * ```
 *
 * @see {@link https://suspensive.org/docs/react-query/Hydrate Documentation}
 */
export async function Hydrate({
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
   * When not set, no timeout is applied.
   */
  timeout?: number
} & OmitKeyof<HydrateProps, 'state'>) {
  const timeoutController = timeout != null && timeout >= 0 ? createTimeoutController(timeout) : undefined
  try {
    const queriesPromise = Promise.all(
      queries.map((query) =>
        'getNextPageParam' in query ? queryClient.fetchInfiniteQuery(query) : queryClient.fetchQuery(query)
      )
    )
    await (timeoutController != null ? Promise.race([queriesPromise, timeoutController.promise]) : queriesPromise)
    timeoutController?.clear()
  } catch {
    timeoutController?.clear()
    queries.forEach((query) => void queryClient.cancelQueries(query))
    if (skipSsrOnError) {
      return (
        <ClientOnly fallback={skipSsrOnError === true ? undefined : skipSsrOnError.fallback}>{children}</ClientOnly>
      )
    }
  }
  return (
    <TanstackHydrate {...props} state={dehydrate(queryClient)}>
      {children}
    </TanstackHydrate>
  )
}

const createTimeoutController = (ms: number) => {
  let timerId: ReturnType<typeof setTimeout> | undefined
  return {
    promise: new Promise<never>((_, reject) => {
      timerId = setTimeout(() => reject(new Error(`Hydrate: timeout after ${ms} ms`)), ms)
    }),
    clear: () => timerId != null && clearTimeout(timerId),
  }
}
