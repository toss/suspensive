'use client'

import { DevMode, Suspensive, SuspensiveProvider } from '@suspensive/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { PropsWithChildren } from 'react'
import { Spinner } from '~/components/uis'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
})

const suspensive = new Suspensive({
  defaultOptions: {
    delay: {
      ms: 1200,
    },
    suspense: {
      fallback: <Spinner />,
    },
  },
})

export const Providers = ({ children }: PropsWithChildren) => (
  <SuspensiveProvider value={suspensive}>
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    <DevMode />
  </SuspensiveProvider>
)
