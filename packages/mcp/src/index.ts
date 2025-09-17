// Core client
export { McpClient, useMcpClient } from './McpClient'
export { McpProvider } from './McpProvider'

// Hooks
export { useMcpPrompts, useMcpPrompt } from './useMcpPrompts'
export { useMcpResource, useMcpResourceContent } from './useMcpResource'
export { useMcpTools, useMcpToolCall } from './useMcpTools'

// Types
export type {
  McpMessage,
  McpError,
  McpResource,
  McpTool,
  McpPrompt,
  McpPromptArgument,
  McpCapabilities,
  McpClientOptions,
  McpTransport,
  McpResourceContent,
  McpListResourcesResponse,
  McpReadResourceResponse,
  McpListToolsResponse,
  McpCallToolRequest,
  McpCallToolResponse,
  McpListPromptsResponse,
  McpGetPromptRequest,
  McpGetPromptResponse,
} from './types'

export type { McpProviderProps } from './McpProvider'
