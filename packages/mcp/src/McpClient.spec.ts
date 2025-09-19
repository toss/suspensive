import { beforeEach, describe, expect, it, vi } from 'vitest'
import { McpClient } from './McpClient'
import type { McpMessage, McpTransport } from './types'

class MockTransport implements McpTransport {
  private messageHandler: ((message: McpMessage) => void) | null = null
  private responses: Map<string, unknown> = new Map()

  send(message: McpMessage): Promise<void> {
    // Simulate async response
    setTimeout(() => {
      const response = this.responses.get(message.method) || { success: true }
      this.messageHandler?.({
        id: message.id,
        method: message.method,
        result: response,
      })
    }, 10)
    return Promise.resolve()
  }

  async receive(): Promise<McpMessage> {
    return new Promise((resolve) => {
      this.messageHandler = resolve
    })
  }

  close(): Promise<void> {
    this.messageHandler = null
    return Promise.resolve()
  }

  setResponse(method: string, response: unknown): void {
    this.responses.set(method, response)
  }
}

describe('McpClient', () => {
  let mockTransport: MockTransport
  let client: McpClient

  beforeEach(() => {
    mockTransport = new MockTransport()
    client = new McpClient({
      transport: mockTransport,
      onError: vi.fn(),
      onMessage: vi.fn(),
    })
  })

  it('should create a client instance', () => {
    expect(client).toBeInstanceOf(McpClient)
  })

  it('should list resources', async () => {
    const mockResources = [
      { uri: 'file://test.txt', name: 'Test File' },
      { uri: 'file://data.json', name: 'Data File' },
    ]

    mockTransport.setResponse('resources/list', { resources: mockResources })

    const resources = await client.listResources()
    expect(resources).toEqual(mockResources)
  })

  it('should read resource content', async () => {
    const mockContent = [{ uri: 'file://test.txt', mimeType: 'text/plain', text: 'Hello, world!' }]

    mockTransport.setResponse('resources/read', { contents: mockContent })

    const content = await client.readResource('file://test.txt')
    expect(content).toEqual(mockContent)
  })

  it('should list tools', async () => {
    const mockTools = [
      { name: 'calculator', description: 'Basic calculator', inputSchema: {} },
      { name: 'weather', description: 'Weather information', inputSchema: {} },
    ]

    mockTransport.setResponse('tools/list', { tools: mockTools })

    const tools = await client.listTools()
    expect(tools).toEqual(mockTools)
  })

  it('should call a tool', async () => {
    const mockResponse = {
      content: [{ type: 'text', text: 'Result: 42' }],
      isError: false,
    }

    mockTransport.setResponse('tools/call', mockResponse)

    const result = await client.callTool({
      name: 'calculator',
      arguments: { expression: '21 * 2' },
    })

    expect(result).toEqual(mockResponse)
  })

  it('should list prompts', async () => {
    const mockPrompts = [
      { name: 'code-review', description: 'Code review prompt' },
      { name: 'documentation', description: 'Documentation prompt' },
    ]

    mockTransport.setResponse('prompts/list', { prompts: mockPrompts })

    const prompts = await client.listPrompts()
    expect(prompts).toEqual(mockPrompts)
  })

  it('should get a prompt', async () => {
    const mockPrompt = {
      description: 'Code review prompt',
      messages: [
        {
          role: 'user',
          content: { type: 'text', text: 'Please review this code' },
        },
      ],
    }

    mockTransport.setResponse('prompts/get', mockPrompt)

    const prompt = await client.getPrompt({
      name: 'code-review',
      arguments: { code: 'const x = 1' },
    })

    expect(prompt).toEqual(mockPrompt)
  })

  it('should close the client', async () => {
    await expect(client.close()).resolves.toBeUndefined()
  })
})
