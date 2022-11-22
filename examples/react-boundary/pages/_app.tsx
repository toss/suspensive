import '../styles/globals.css'
import type { AppProps } from 'next/app'
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
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default MyApp

const Layout = styled.div`
  padding-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`
