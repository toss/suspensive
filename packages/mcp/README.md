# @suspensive/mcp

Suspensive interface for Model Context Protocol (MCP), providing React components and hooks that integrate seamlessly with React Suspense.

## Installation

```bash
npm install @suspensive/mcp
# or
pnpm install @suspensive/mcp
# or
yarn add @suspensive/mcp
```

## Overview

The Model Context Protocol (MCP) is a standardized protocol for communication between AI applications and data sources. This package provides React components and hooks that make it easy to integrate MCP clients into React applications with full Suspense support.

## Quick Start

### 1. Setup MCP Provider

```tsx
import { McpProvider } from '@suspensive/mcp'
import { Suspense } from '@suspensive/react'

// You need to implement or use an MCP transport
class WebSocketTransport implements McpTransport {
  // Implementation details...
}

function App() {
  const transport = new WebSocketTransport('ws://localhost:8080')
  
  return (
    <McpProvider options={{ transport }}>
      <Suspense fallback={<div>Loading...</div>}>
        <MyMcpComponents />
      </Suspense>
    </McpProvider>
  )
}
```

### 2. Use MCP Resources

```tsx
import { useMcpResource, useMcpResourceContent } from '@suspensive/mcp'

function ResourceList() {
  const { resources, readResource } = useMcpResource()
  
  return (
    <div>
      <h2>Available Resources</h2>
      {resources.map(resource => (
        <ResourceItem key={resource.uri} resource={resource} />
      ))}
    </div>
  )
}

function ResourceItem({ resource }) {
  const content = useMcpResourceContent({ 
    uri: resource.uri,
    immediate: true 
  })
  
  return (
    <div>
      <h3>{resource.name}</h3>
      <p>{resource.description}</p>
      {content && (
        <pre>{content[0]?.text}</pre>
      )}
    </div>
  )
}
```

### 3. Use MCP Tools

```tsx
import { useMcpTools } from '@suspensive/mcp'

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

### 4. Use MCP Prompts

```tsx
import { useMcpPrompts, useMcpPrompt } from '@suspensive/mcp'

function PromptList() {
  const { prompts } = useMcpPrompts()
  
  return (
    <div>
      <h2>Available Prompts</h2>
      {prompts.map(prompt => (
        <PromptItem key={prompt.name} prompt={prompt} />
      ))}
    </div>
  )
}

function PromptItem({ prompt }) {
  const promptData = useMcpPrompt({
    name: prompt.name,
    arguments: { topic: 'React Suspense' },
    immediate: true
  })
  
  if (!promptData) return null
  
  return (
    <div>
      <h3>{prompt.name}</h3>
      <p>{promptData.description}</p>
      {promptData.messages.map((message, index) => (
        <div key={index}>
          <strong>{message.role}:</strong>
          <p>{message.content.text}</p>
        </div>
      ))}
    </div>
  )
}
```

## API Reference

### Components

- `McpProvider` - Context provider for MCP client
- All hooks integrate with React Suspense and will suspend while loading

### Hooks

- `useMcpClient()` - Access the MCP client instance
- `useMcpResource(options?)` - List and manage MCP resources
- `useMcpResourceContent({ uri, enabled? })` - Read resource content
- `useMcpTools()` - List and call MCP tools
- `useMcpToolCall({ name, arguments?, enabled?, immediate? })` - Execute a tool call
- `useMcpPrompts()` - List and get MCP prompts
- `useMcpPrompt({ name, arguments?, enabled?, immediate? })` - Get a specific prompt

### Types

All MCP protocol types are exported, including:
- `McpMessage`, `McpError`, `McpResource`, `McpTool`, `McpPrompt`
- `McpTransport`, `McpClientOptions`, `McpCapabilities`
- Response and request types for all operations

## Integration with Suspensive

This package is designed to work seamlessly with other `@suspensive` packages:

```tsx
import { ErrorBoundary, Suspense, Delay } from '@suspensive/react'
import { McpProvider, useMcpResource } from '@suspensive/mcp'

function App() {
  return (
    <McpProvider options={{ transport }}>
      <ErrorBoundary fallback={({ error }) => <div>Error: {error.message}</div>}>
        <Suspense fallback={<div>Loading resources...</div>}>
          <Delay ms={200}>
            <ResourceList />
          </Delay>
        </Suspense>
      </ErrorBoundary>
    </McpProvider>
  )
}
```

## Error Handling

All MCP operations are wrapped with proper error handling and will throw errors that can be caught by `ErrorBoundary`:

```tsx
import { ErrorBoundary } from '@suspensive/react'

function App() {
  return (
    <ErrorBoundary 
      fallback={({ error, reset }) => (
        <div>
          <p>MCP Error: {error.message}</p>
          <button onClick={reset}>Retry</button>
        </div>
      )}
    >
      <McpComponents />
    </ErrorBoundary>
  )
}
```

## License

MIT © [Toss](https://github.com/toss)