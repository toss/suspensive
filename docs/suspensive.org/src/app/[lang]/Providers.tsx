'use client'

import { createGetQueryClient } from '@suspensive/react-query-5'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const { getQueryClient } = createGetQueryClient()

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
