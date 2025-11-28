import { QueryClient, type QueryClientConfig, isServer } from '@tanstack/react-query'

let browserQueryClient: QueryClient | undefined

/**
 * A utility function to manage QueryClient instances in a server-safe manner.
 * - On the server: Always creates a new QueryClient instance for each request
 * - In the browser: Returns a singleton QueryClient instance, creating one if it doesn't exist
 *
 * This pattern is essential for proper React Query usage with SSR frameworks like Next.js,
 * as it prevents sharing QueryClient state between requests on the server while
 * maintaining a single instance in the browser to preserve cache across re-renders.
 *
 * @remarks
 * In the browser environment, the config parameter is only used when creating the initial
 * QueryClient instance. Subsequent calls with different configs will return the existing
 * instance and the new config will be ignored. This is intentional to maintain a stable
 * singleton across re-renders.
 *
 * @param config - Optional QueryClientConfig to customize the QueryClient instance
 * @returns A QueryClient instance
 *
 * @example
 * ```tsx
 * import { getQueryClient } from '@suspensive/react-query'
 * import { QueryClientProvider } from '@tanstack/react-query'
 *
 * function Providers({ children }: { children: React.ReactNode }) {
 *   const queryClient = getQueryClient()
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       {children}
 *     </QueryClientProvider>
 *   )
 * }
 * ```
 */
export function getQueryClient(config?: QueryClientConfig): QueryClient {
  if (isServer) {
    // Server: always make a new query client
    return new QueryClient({
      ...config,
      defaultOptions: {
        ...config?.defaultOptions,
        queries: {
          ...config?.defaultOptions?.queries,
          cacheTime: Infinity,
        },
      },
    })
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient(config)
  }
  return browserQueryClient
}
