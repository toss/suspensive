'use client'

import { CacheStore, CacheStoreProvider } from '@suspensive/cache'
import { DevMode, Suspensive, SuspensiveProvider } from '@suspensive/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type PropsWithChildren, useState } from 'react'
import { Spinner } from '~/components/uis'

export const Providers = ({ children }: PropsWithChildren) => {
  const cacheStore = useState(new CacheStore())[0]
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
  const suspensive = useState(
    () =>
      new Suspensive({
        defaultProps: {
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
    <CacheStoreProvider store={cacheStore}>
      <SuspensiveProvider value={suspensive}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <DevMode position="bottomRight" />
      </SuspensiveProvider>
    </CacheStoreProvider>
  )
}
