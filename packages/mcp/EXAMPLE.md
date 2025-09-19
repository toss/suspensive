# @suspensive/mcp Example

This example demonstrates how to use the `@suspensive/mcp` package to integrate Model Context Protocol (MCP) clients with React Suspense.

## Basic Usage

```tsx
import { McpProvider, useMcpResource, useMcpTools } from '@suspensive/mcp'
import { Suspense, ErrorBoundary } from '@suspensive/react'

// Example WebSocket transport (you need to implement this)
class WebSocketTransport {
  constructor(private url: string) {}
  
  async send(message: McpMessage): Promise<void> {
    // Send message via WebSocket
  }
  
  async receive(): Promise<McpMessage> {
    // Receive message via WebSocket
    return new Promise((resolve) => {
      // Your WebSocket message handler
    })
  }
  
  async close(): Promise<void> {
    // Close WebSocket connection
  }
}

function App() {
  const transport = new WebSocketTransport('ws://localhost:8080')
  
  return (
    <McpProvider options={{ transport }}>
      <ErrorBoundary fallback={({ error }) => <div>Error: {error.message}</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <McpDemo />
        </Suspense>
      </ErrorBoundary>
    </McpProvider>
  )
}

function McpDemo() {
  return (
    <div>
      <h1>MCP Demo</h1>
      <ResourceList />
      <ToolList />
    </div>
  )
}

function ResourceList() {
  const { resources, readResource } = useMcpResource()
  
  return (
    <div>
      <h2>Available Resources</h2>
      {resources.map(resource => (
        <div key={resource.uri}>
          <h3>{resource.name}</h3>
          <p>{resource.description}</p>
          <button onClick={() => readResource(resource.uri)}>
            Read Content
          </button>
        </div>
      ))}
    </div>
  )
}

function ToolList() {
  const { tools, callTool } = useMcpTools()
  
  const handleToolCall = async (toolName: string) => {
    try {
      const result = await callTool({
        name: toolName,
        arguments: { input: 'Hello, world!' }
      })
      console.log('Tool result:', result)
    } catch (error) {
      console.error('Tool call failed:', error)
    }
  }
  
  return (
    <div>
      <h2>Available Tools</h2>
      {tools.map(tool => (
        <div key={tool.name}>
          <h3>{tool.name}</h3>
          <p>{tool.description}</p>
          <button onClick={() => handleToolCall(tool.name)}>
            Call Tool
          </button>
        </div>
      ))}
    </div>
  )
}
```

## Key Features

- **Suspense Integration**: All MCP operations work seamlessly with React Suspense
- **Error Boundaries**: Proper error handling with ErrorBoundary components
- **TypeScript Support**: Full TypeScript definitions for MCP protocol
- **Caching**: Built-in caching for better performance
- **Resource Management**: Easy management of MCP resources, tools, and prompts

## API

### Components

- `McpProvider` - Context provider for MCP client
- All hooks suspend while loading data

### Hooks

- `useMcpClient()` - Access the MCP client instance
- `useMcpResource()` - List and manage MCP resources
- `useMcpResourceContent({ uri })` - Read resource content
- `useMcpTools()` - List and call MCP tools
- `useMcpPrompts()` - List and get MCP prompts

For detailed API documentation, see the [main README](../README.md).