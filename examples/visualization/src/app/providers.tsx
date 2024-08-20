'use client'

import { Cache, CacheProvider } from '@suspensive/cache'
import { DefaultProps, DefaultPropsProvider } from '@suspensive/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type PropsWithChildren, useState } from 'react'
import { Spinner } from '~/components/uis'

export const Providers = ({ children }: PropsWithChildren) => {
  const cache = useState(() => new Cache())[0]
  const queryClient = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 0 } } }))[0]
  const defaultProps = useState(() => new DefaultProps({ Delay: { ms: 1200 }, Suspense: { fallback: <Spinner /> } }))[0]

  return (
    <CacheProvider cache={cache}>
      <DefaultPropsProvider defaultProps={defaultProps}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </DefaultPropsProvider>
    </CacheProvider>
  )
}
