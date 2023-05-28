import React, { PropsWithChildren } from 'react'
import { SuspensiveConfigs, SuspensiveProvider } from '@suspensive/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Spinner } from '../../../components/uis'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
})

const suspensiveConfigs = new SuspensiveConfigs({
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
  <SuspensiveProvider configs={suspensiveConfigs}>
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </SuspensiveProvider>
)
