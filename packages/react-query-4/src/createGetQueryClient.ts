import { QueryClient, type QueryClientConfig, isServer } from '@tanstack/react-query'

/**
 * Creates a function that returns a QueryClient instance, with different behavior for server and client environments.
 *
 * On the server, it always creates a new QueryClient instance with `cacheTime: Infinity` to prevent data from being garbage collected.
 * On the client, it reuses the same QueryClient instance to avoid recreating it during React's initial render suspension.
 *
 * @experimental This component is experimental and may be changed or removed in the future.
 *
 * @param config - Optional QueryClient configuration. On the server, `cacheTime` will be automatically set to `Infinity`.
 * @returns An object containing a `getQueryClient` function that returns a QueryClient instance.
 *
 * @example
 * ```tsx
 * // Create a get-query-client.ts file in your project:
 * // get-query-client.ts
 * import { createGetQueryClient } from '@suspensive/react-query'
 *
 * export const { getQueryClient } = createGetQueryClient()
 *
 * @example
 * ```tsx
 * // Then import and use it in your code:
 * // app/providers.tsx
 * 'use client'
 *
 * import { QueryClientProvider } from '@tanstack/react-query'
 * import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
 * import { getQueryClient } from '@/app/get-query-client'
 * import type * as React from 'react'
 *
 * export default function Providers({ children }: { children: React.ReactNode }) {
 *   const queryClient = getQueryClient()
 *
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       {children}
 *       <ReactQueryDevtools />
 *     </QueryClientProvider>
 *   )
 * }
 * ```
 *
 * @see {@link https://suspensive.org/docs/react-query/createGetQueryClient Suspensive Docs}
 */
export function createGetQueryClient(config: QueryClientConfig = {}) {
  let browserQueryClient: QueryClient | undefined
  const getQueryClientConfig: QueryClientConfig = isServer
    ? {
        ...config,
        defaultOptions: {
          ...config.defaultOptions,
          queries: {
            ...config.defaultOptions?.queries,
            cacheTime: Infinity,
          },
        },
      }
    : config

  function getQueryClient() {
    if (isServer) {
      // Server: always make a new query client
      return new QueryClient(getQueryClientConfig)
    }
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) {
      browserQueryClient = new QueryClient(getQueryClientConfig)
    }
    return browserQueryClient
  }

  return { getQueryClient }
}
