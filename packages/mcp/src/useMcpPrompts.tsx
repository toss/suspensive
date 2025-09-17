import { use, useCallback, useMemo } from 'react'
import { useMcpClient } from './McpClient'
import type { McpGetPromptRequest, McpGetPromptResponse, McpPrompt } from './types'

export interface UseMcpPromptsResult {
  prompts: McpPrompt[]
  getPrompt: (request: McpGetPromptRequest) => Promise<McpGetPromptResponse>
  refresh: () => void
}

/**
 * Hook to manage MCP prompts with React Suspense.
 * This hook will suspend while prompts are being loaded.
 *
 * @example
 * ```tsx
 * import { useMcpPrompts } from '@suspensive/mcp'
 * import { Suspense } from '@suspensive/react'
 *
 * function PromptList() {
 *   const { prompts, getPrompt } = useMcpPrompts()
 *
 *   const handleGetPrompt = async (promptName: string) => {
 *     try {
 *       const result = await getPrompt({
 *         name: promptName,
 *         arguments: { topic: 'React Suspense' }
 *       })
 *       console.log('Prompt result:', result)
 *     } catch (error) {
 *       console.error('Get prompt failed:', error)
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       {prompts.map(prompt => (
 *         <div key={prompt.name}>
 *           <h3>{prompt.name}</h3>
 *           <p>{prompt.description}</p>
 *           <button onClick={() => handleGetPrompt(prompt.name)}>
 *             Get Prompt
 *           </button>
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 *
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Loading prompts...</div>}>
 *       <PromptList />
 *     </Suspense>
 *   )
 * }
 * ```
 */
export function useMcpPrompts(): UseMcpPromptsResult {
  const client = useMcpClient()

  // Create a promise for prompt listing that can be cached
  const promptsPromise = useMemo(() => {
    return client.listPrompts()
  }, [client])

  // Use React's `use` hook to suspend until prompts are loaded
  const prompts = use(promptsPromise)

  const getPrompt = useCallback(
    async (request: McpGetPromptRequest): Promise<McpGetPromptResponse> => {
      return client.getPrompt(request)
    },
    [client]
  )

  const refresh = useCallback(() => {
    // Force a refresh by invalidating the cache
    // This would typically trigger a re-render and new promise creation
  }, [])

  return {
    prompts,
    getPrompt,
    refresh,
  }
}

export interface UseMcpPromptOptions {
  name: string
  arguments?: Record<string, unknown>
  /**
   * Whether to enable the hook. If false, the hook will not fetch the prompt.
   * @default true
   */
  enabled?: boolean
  /**
   * Whether to fetch the prompt immediately when the component mounts.
   * @default false
   */
  immediate?: boolean
}

/**
 * Hook to get an MCP prompt with React Suspense.
 * This hook will suspend while the prompt is being fetched (if immediate is true).
 *
 * @example
 * ```tsx
 * import { useMcpPrompt } from '@suspensive/mcp'
 * import { Suspense } from '@suspensive/react'
 *
 * function PromptDisplay({ promptName }: { promptName: string }) {
 *   const prompt = useMcpPrompt({
 *     name: promptName,
 *     arguments: { topic: 'React Suspense' },
 *     immediate: true
 *   })
 *
 *   if (!prompt) return null
 *
 *   return (
 *     <div>
 *       <h3>Prompt Response</h3>
 *       <p>{prompt.description}</p>
 *       {prompt.messages.map((message, index) => (
 *         <div key={index}>
 *           <strong>{message.role}:</strong>
 *           <p>{message.content.text}</p>
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 *
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Loading prompt...</div>}>
 *       <PromptDisplay promptName="code-review" />
 *     </Suspense>
 *   )
 * }
 * ```
 */
export function useMcpPrompt({
  name,
  arguments: args,
  enabled = true,
  immediate = false,
}: UseMcpPromptOptions): McpGetPromptResponse | null {
  const client = useMcpClient()

  const promptPromise = useMemo(() => {
    if (!enabled || !immediate) {
      return Promise.resolve(null)
    }
    return client.getPrompt({ name, arguments: args })
  }, [client, name, args, enabled, immediate])

  return use(promptPromise)
}
