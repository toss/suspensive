import { createContext, useContext } from 'react'
import type {
  McpCallToolRequest,
  McpCallToolResponse,
  McpClientOptions,
  McpError,
  McpGetPromptRequest,
  McpGetPromptResponse,
  McpListPromptsResponse,
  McpListResourcesResponse,
  McpListToolsResponse,
  McpMessage,
  McpPrompt,
  McpReadResourceResponse,
  McpResource,
  McpResourceContent,
  McpTool,
} from './types'

export class McpClient {
  private options: McpClientOptions
  private requestId = 0
  private pendingRequests = new Map<
    string | number,
    {
      resolve: (value: unknown) => void
      reject: (error: McpError) => void
    }
  >()
  private cache = new Map<string, { data: unknown; timestamp: number }>()
  private readonly CACHE_TTL = 5000 // 5 seconds

  constructor(options: McpClientOptions) {
    this.options = options
    this.setupTransport()
  }

  private setupTransport(): void {
    // Setup message handling
    this.options.transport
      .receive()
      .then((message) => {
        this.handleMessage(message)
      })
      .catch((error: unknown) => {
        this.options.onError?.(error as McpError)
      })
  }

  private handleMessage(message: McpMessage): void {
    this.options.onMessage?.(message)

    if (message.id && this.pendingRequests.has(message.id)) {
      const request = this.pendingRequests.get(message.id)
      if (request) {
        this.pendingRequests.delete(message.id)

        if (message.error) {
          request.reject(message.error)
        } else {
          request.resolve(message.result)
        }
      }
    }
  }

  private async sendRequest<T>(method: string, params?: Record<string, unknown>): Promise<T> {
    const id = ++this.requestId
    const message: McpMessage = {
      id,
      method,
      params,
    }

    const cacheKey = `${method}:${JSON.stringify(params)}`
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T
    }

    return new Promise<T>((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve: (value: unknown) => resolve(value as T),
        reject,
      })

      this.options.transport.send(message).catch((error: unknown) => {
        this.pendingRequests.delete(id)
        reject(new Error(error instanceof Error ? error.message : String(error)))
      })
    }).then((result) => {
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() })
      return result
    })
  }

  async listResources(): Promise<McpResource[]> {
    const response = await this.sendRequest<McpListResourcesResponse>('resources/list')
    return response.resources
  }

  async readResource(uri: string): Promise<McpResourceContent[]> {
    const response = await this.sendRequest<McpReadResourceResponse>('resources/read', { uri })
    return response.contents
  }

  async listTools(): Promise<McpTool[]> {
    const response = await this.sendRequest<McpListToolsResponse>('tools/list')
    return response.tools
  }

  async callTool(request: McpCallToolRequest): Promise<McpCallToolResponse> {
    return this.sendRequest<McpCallToolResponse>('tools/call', request)
  }

  async listPrompts(): Promise<McpPrompt[]> {
    const response = await this.sendRequest<McpListPromptsResponse>('prompts/list')
    return response.prompts
  }

  async getPrompt(request: McpGetPromptRequest): Promise<McpGetPromptResponse> {
    return this.sendRequest<McpGetPromptResponse>('prompts/get', request)
  }

  async close(): Promise<void> {
    await this.options.transport.close()
    this.pendingRequests.clear()
    this.cache.clear()
  }
}

export const McpClientContext = createContext<McpClient | null>(null)

export function useMcpClient(): McpClient {
  const client = useContext(McpClientContext)
  if (!client) {
    throw new Error('useMcpClient must be used within a McpProvider')
  }
  return client
}
