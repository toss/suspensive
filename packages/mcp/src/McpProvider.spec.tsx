import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { McpClient } from './McpClient'
import { McpProvider } from './McpProvider'
import type { McpTransport } from './types'

class MockTransport implements McpTransport {
  send(): Promise<void> {
    return Promise.resolve()
  }

  async receive(): Promise<never> {
    return new Promise(() => {
      // Never resolves for testing
    })
  }

  close(): Promise<void> {
    return Promise.resolve()
  }
}

describe('McpProvider', () => {
  it('should render children', () => {
    const mockClient = new McpClient({
      transport: new MockTransport(),
    })

    const { getByText } = render(
      <McpProvider client={mockClient}>
        <div>Test Content 1</div>
      </McpProvider>
    )

    expect(getByText('Test Content 1')).toBeInTheDocument()
  })

  it('should create client from options', () => {
    const { getByText } = render(
      <McpProvider options={{ transport: new MockTransport() }}>
        <div>Test Content 2</div>
      </McpProvider>
    )

    expect(getByText('Test Content 2')).toBeInTheDocument()
  })

  it('should throw error when neither client nor options provided', () => {
    expect(() => {
      render(
        <McpProvider>
          <div>Test Content 3</div>
        </McpProvider>
      )
    }).toThrow('McpProvider requires either a client or options prop')
  })
})
