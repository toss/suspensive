'use client'

import { DevMode, Suspensive, SuspensiveProvider } from '@suspensive/react'
import { AwaitClient, AwaitClientProvider } from '@suspensive/react-await'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type PropsWithChildren, useState } from 'react'
import { Spinner } from '~/components/uis'

export const Providers = ({ children }: PropsWithChildren) => {
  const queryClient = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
          },
        },
      })
  )[0]

  const awaitClient = useState(() => new AwaitClient())[0]

  const suspensive = useState(
    () =>
      new Suspensive({
        defaultOptions: {
          delay: {
            ms: 1200,
          },
          suspense: {
            fallback: <Spinner />,
          },
        },
      })
  )[0]

  return (
    <SuspensiveProvider value={suspensive}>
      <AwaitClientProvider client={awaitClient}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AwaitClientProvider>
      <DevMode />
    </SuspensiveProvider>
  )
}
