'use client'

import { createGetQueryClient } from '@suspensive/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { HeroLogoInViewProvider } from '@/contexts/HeroLogoInViewContext'

const { getQueryClient } = createGetQueryClient()

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <HeroLogoInViewProvider>{children}</HeroLogoInViewProvider>
    </QueryClientProvider>
  )
}
