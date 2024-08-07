'use client'

import { Suspensive, SuspensiveProvider } from '@suspensive/react'
import { ReactQueryStreamedHydration } from '@suspensive/react-query-next-experimental-4'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type ReactNode, useState } from 'react'

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      })
  )
  const [suspensive] = useState(
    () =>
      new Suspensive({
        defaultProps: {
          suspense: { fallback: <div>loading...</div> },
        },
      })
  )

  return (
    <SuspensiveProvider value={suspensive}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>{props.children}</ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SuspensiveProvider>
  )
}
