import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Image from 'next/image'
import Link from 'next/link'
import styled from '@emotion/styled'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      retryDelay: 1000,
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TopNav>
        <Image src={'/logo_notcropped.png'} width={40} height={40} alt="logo" />
        <Link href={'/'}>{"Suspensive's Concepts Visualization"}</Link>
      </TopNav>

      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default MyApp

const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`

const TopNav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  font-weight: 500;
  background-color: #ffffff20;
`
