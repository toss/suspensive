import { use, useCallback, useMemo } from 'react'
import { useMcpClient } from './McpClient'
import type { McpCallToolRequest, McpCallToolResponse, McpTool } from './types'

export interface UseMcpToolsResult {
  tools: McpTool[]
  callTool: (request: McpCallToolRequest) => Promise<McpCallToolResponse>
  refresh: () => void
}

/**
 * Hook to manage MCP tools with React Suspense.
 * This hook will suspend while tools are being loaded.
 *
 * @example
 * ```tsx
 * import { useMcpTools } from '@suspensive/mcp'
 * import { Suspense } from '@suspensive/react'
 *
 * function ToolList() {
 *   const { tools, callTool } = useMcpTools()
 *
 *   const handleToolCall = async (toolName: string) => {
 *     try {
 *       const result = await callTool({
 *         name: toolName,
 *         arguments: { input: 'Hello, world!' }
 *       })
 *       console.log('Tool result:', result)
 *     } catch (error) {
 *       console.error('Tool call failed:', error)
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       {tools.map(tool => (
 *         <div key={tool.name}>
 *           <h3>{tool.name}</h3>
 *           <p>{tool.description}</p>
 *           <button onClick={() => handleToolCall(tool.name)}>
 *             Call Tool
 *           </button>
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 *
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Loading tools...</div>}>
 *       <ToolList />
 *     </Suspense>
 *   )
 * }
 * ```
 */
export function useMcpTools(): UseMcpToolsResult {
  const client = useMcpClient()

  // Create a promise for tool listing that can be cached
  const toolsPromise = useMemo(() => {
    return client.listTools()
  }, [client])

  // Use React's `use` hook to suspend until tools are loaded
  const tools = use(toolsPromise)

  const callTool = useCallback(
    async (request: McpCallToolRequest): Promise<McpCallToolResponse> => {
      return client.callTool(request)
    },
    [client]
  )

  const refresh = useCallback(() => {
    // Force a refresh by invalidating the cache
    // This would typically trigger a re-render and new promise creation
  }, [])

  return {
    tools,
    callTool,
    refresh,
  }
}

export interface UseMcpToolCallOptions {
  name: string
  arguments?: Record<string, unknown>
  /**
   * Whether to enable the hook. If false, the hook will not execute the tool.
   * @default true
   */
  enabled?: boolean
  /**
   * Whether to execute the tool call immediately when the component mounts.
   * @default false
   */
  immediate?: boolean
}

/**
 * Hook to execute an MCP tool call with React Suspense.
 * This hook will suspend while the tool is being executed (if immediate is true).
 *
 * @example
 * ```tsx
 * import { useMcpToolCall } from '@suspensive/mcp'
 * import { Suspense } from '@suspensive/react'
 *
 * function ToolResult({ toolName }: { toolName: string }) {
 *   const result = useMcpToolCall({
 *     name: toolName,
 *     arguments: { input: 'Hello, world!' },
 *     immediate: true
 *   })
 *
 *   return (
 *     <div>
 *       <h3>Tool Result</h3>
 *       {result.content.map((content, index) => (
 *         <div key={index}>
 *           {content.text && <p>{content.text}</p>}
 *           {content.data && <pre>{JSON.stringify(content.data, null, 2)}</pre>}
 *         </div>
 *       ))}
 *       {result.isError && <p style={{ color: 'red' }}>Error occurred</p>}
 *     </div>
 *   )
 * }
 *
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Executing tool...</div>}>
 *       <ToolResult toolName="example-tool" />
 *     </Suspense>
 *   )
 * }
 * ```
 */
export function useMcpToolCall({
  name,
  arguments: args,
  enabled = true,
  immediate = false,
}: UseMcpToolCallOptions): McpCallToolResponse | null {
  const client = useMcpClient()

  const toolCallPromise = useMemo(() => {
    if (!enabled || !immediate) {
      return Promise.resolve(null)
    }
    return client.callTool({ name, arguments: args })
  }, [client, name, args, enabled, immediate])

  return use(toolCallPromise)
}
