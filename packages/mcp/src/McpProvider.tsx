import { type ReactNode } from 'react'
import { McpClient, McpClientContext } from './McpClient'
import type { McpClientOptions } from './types'

export interface McpProviderProps {
  children: ReactNode
  client?: McpClient
  options?: McpClientOptions
}

/**
 * McpProvider provides MCP client context to child components.
 *
 * @example
 * ```tsx
 * import { McpProvider } from '@suspensive/mcp'
 *
 * function App() {
 *   const transport = new WebSocketTransport('ws://localhost:8080')
 *
 *   return (
 *     <McpProvider options={{ transport }}>
 *       <MyComponent />
 *     </McpProvider>
 *   )
 * }
 * ```
 */
export function McpProvider({ children, client, options }: McpProviderProps) {
  if (!client && !options) {
    throw new Error('McpProvider requires either a client or options prop')
  }

  const mcpClient = client || (options ? new McpClient(options) : null)

  if (!mcpClient) {
    throw new Error('McpProvider requires either a client or options prop')
  }

  return <McpClientContext.Provider value={mcpClient}>{children}</McpClientContext.Provider>
}
