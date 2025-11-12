'use client'

import { type UseMutationOptions, type UseMutationResult, useMutation } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export function Mutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>({
  children,
  ...options
}: UseMutationOptions<TData, TError, TVariables, TContext> & {
  children: (mutationResult: UseMutationResult<TData, TError, TVariables, TContext>) => ReactNode
}) {
  return <>{children(useMutation(options))}</>
}
