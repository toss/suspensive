/**
 * MCP (Model Context Protocol) Types
 *
 * Core types for Model Context Protocol communication
 * https://spec.modelcontextprotocol.io/
 */

export interface McpMessage {
  id: string | number
  method: string
  params?: Record<string, unknown>
  result?: unknown
  error?: McpError
}

export interface McpError {
  code: number
  message: string
  data?: unknown
}

export interface McpResource {
  uri: string
  name: string
  description?: string
  mimeType?: string
}

export interface McpTool {
  name: string
  description?: string
  inputSchema: Record<string, unknown>
}

export interface McpPrompt {
  name: string
  description?: string
  arguments?: McpPromptArgument[]
}

export interface McpPromptArgument {
  name: string
  description?: string
  required?: boolean
}

export interface McpCapabilities {
  logging?: Record<string, unknown>
  prompts?: {
    listChanged?: boolean
  }
  resources?: {
    subscribe?: boolean
    listChanged?: boolean
  }
  tools?: {
    listChanged?: boolean
  }
}

export interface McpClientOptions {
  transport: McpTransport
  capabilities?: McpCapabilities
  onError?: (error: McpError) => void
  onMessage?: (message: McpMessage) => void
}

export interface McpTransport {
  send(message: McpMessage): Promise<void>
  receive(): Promise<McpMessage>
  close(): Promise<void>
}

export interface McpResourceContent {
  uri: string
  mimeType?: string
  text?: string
  blob?: ArrayBuffer
}

export interface McpListResourcesResponse {
  resources: McpResource[]
}

export interface McpReadResourceResponse {
  contents: McpResourceContent[]
}

export interface McpListToolsResponse {
  tools: McpTool[]
}

export interface McpCallToolRequest extends Record<string, unknown> {
  name: string
  arguments?: Record<string, unknown>
}

export interface McpCallToolResponse {
  content: Array<{
    type: string
    text?: string
    data?: unknown
  }>
  isError?: boolean
}

export interface McpListPromptsResponse {
  prompts: McpPrompt[]
}

export interface McpGetPromptRequest extends Record<string, unknown> {
  name: string
  arguments?: Record<string, unknown>
}

export interface McpGetPromptResponse {
  description?: string
  messages: Array<{
    role: string
    content: {
      type: string
      text?: string
    }
  }>
}
