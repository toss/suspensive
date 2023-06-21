'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SuspensiveConfigs, SuspensiveProvider } from '@suspensive/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PropsWithChildren } from 'react'
import { Spinner } from '../components/uis'
// These styles apply to every route in the application
import './global.css'
import { Flex, MediaQueryProvider } from '@jsxcss/emotion'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TopNavigation />
          <Link href="/react/useSuspenseCache">🔗 Experimental Feature: useSuspenseCache</Link>
          <Flex.Center flex={1}>{children}</Flex.Center>
        </Providers>
      </body>
    </html>
  )
}

const TopNavigation = () => (
  <Flex.Center as={'nav'} padding={'8px 16px'} fontWeight={500} backgroundColor={'#ffffff20'}>
    <Link href="/">
      <Flex align={'center'}>
        <Image src="/logo_notcropped.png" width={40} height={40} alt="logo" />
        Suspensive's Concepts Visualization
      </Flex>
    </Link>
  </Flex.Center>
)

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

const Providers = ({ children }: PropsWithChildren) => (
  <MediaQueryProvider>
    <SuspensiveProvider configs={suspensiveConfigs}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SuspensiveProvider>
  </MediaQueryProvider>
)
