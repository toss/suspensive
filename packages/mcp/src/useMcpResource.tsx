import { use, useMemo } from 'react'
import { useMcpClient } from './McpClient'
import type { McpResource, McpResourceContent } from './types'

export interface UseMcpResourceOptions {
  /**
   * Whether to automatically read resource content when the resource is loaded.
   * @default false
   */
  autoRead?: boolean

  /**
   * Custom cache key for the resource. If not provided, the URI will be used.
   */
  cacheKey?: string
}

export interface UseMcpResourceResult {
  resources: McpResource[]
  readResource: (uri: string) => Promise<McpResourceContent[]>
  refresh: () => void
}

/**
 * Hook to manage MCP resources with React Suspense.
 * This hook will suspend while resources are being loaded.
 *
 * @example
 * ```tsx
 * import { useMcpResource } from '@suspensive/mcp'
 * import { Suspense } from '@suspensive/react'
 *
 * function ResourceList() {
 *   const { resources, readResource } = useMcpResource()
 *
 *   return (
 *     <div>
 *       {resources.map(resource => (
 *         <div key={resource.uri}>
 *           <h3>{resource.name}</h3>
 *           <button onClick={() => readResource(resource.uri)}>
 *             Read Content
 *           </button>
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 *
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Loading resources...</div>}>
 *       <ResourceList />
 *     </Suspense>
 *   )
 * }
 * ```
 */
export function useMcpResource(): UseMcpResourceResult {
  const client = useMcpClient()

  // Create a promise for resource listing that can be cached
  const resourcesPromise = useMemo(() => {
    return client.listResources()
  }, [client])

  // Use React's `use` hook to suspend until resources are loaded
  const resources = use(resourcesPromise)

  const readResource = useMemo(() => {
    return async (uri: string): Promise<McpResourceContent[]> => {
      return client.readResource(uri)
    }
  }, [client])

  const refresh = useMemo(() => {
    return () => {
      // Force a refresh by invalidating the cache
      // This would typically trigger a re-render and new promise creation
    }
  }, [])

  return {
    resources,
    readResource,
    refresh,
  }
}

export interface UseMcpResourceContentOptions {
  uri: string
  /**
   * Whether to enable the hook. If false, the hook will not fetch data.
   * @default true
   */
  enabled?: boolean
}

/**
 * Hook to read MCP resource content with React Suspense.
 * This hook will suspend while content is being loaded.
 *
 * @example
 * ```tsx
 * import { useMcpResourceContent } from '@suspensive/mcp'
 * import { Suspense } from '@suspensive/react'
 *
 * function ResourceContent({ uri }: { uri: string }) {
 *   const { content } = useMcpResourceContent({ uri })
 *
 *   return (
 *     <div>
 *       {content.map((item, index) => (
 *         <div key={index}>
 *           <p>Type: {item.mimeType}</p>
 *           {item.text && <pre>{item.text}</pre>}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 *
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Loading content...</div>}>
 *       <ResourceContent uri="file://example.txt" />
 *     </Suspense>
 *   )
 * }
 * ```
 */
export function useMcpResourceContent({ uri, enabled = true }: UseMcpResourceContentOptions): McpResourceContent[] {
  const client = useMcpClient()

  const contentPromise = useMemo(() => {
    if (!enabled) {
      return Promise.resolve([])
    }
    return client.readResource(uri)
  }, [client, uri, enabled])

  return use(contentPromise)
}
