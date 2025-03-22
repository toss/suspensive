import type { UseMutationOptions } from '@tanstack/react-query'

/**
 * @experimental This is experimental feature.
 */
export function mutationOptions<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationOptions<TData, TError, TVariables, TContext> {
  return options
}
