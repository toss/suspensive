'use client'

import { DefaultProps, DefaultPropsProvider } from '@suspensive/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { type ReactNode, useState } from 'react'

export function Providers(props: { children: ReactNode }) {
  const queryClient = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 1000 } } }))[0]
  const defaultProps = useState(() => new DefaultProps({ suspense: { fallback: <div>loading...</div> } }))[0]

  return (
    <DefaultPropsProvider defaultProps={defaultProps}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>{props.children}</ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </DefaultPropsProvider>
  )
}
