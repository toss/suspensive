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
    },
  },
})

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TopNav>
        <Link href={'/'}>
          <Home>
            <Image src={'/logo_notcropped.png'} width={40} height={40} alt="logo" />
            {"Suspensive's Concepts Visualization"}
          </Home>
        </Link>
      </TopNav>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

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

const Home = styled.span`
  display: flex;
  align-items: center;
`
