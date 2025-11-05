import { ErrorBoundary, Suspense } from '@suspensive/react'
import { QueriesHydrationBoundary } from '@suspensive/react-query-5'
import Image from 'next/image'
import { ReactClientComponent } from './_components/ReactClientComponent'
import { ReloadButton } from './_components/ReloadButton'
import { query } from '~/query'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>page</h1>
        <ReloadButton />
      </div>
      <Image
        height={200}
        width={200}
        src="https://raw.githubusercontent.com/toss/suspensive/main/assets/readme_main.svg"
        alt=""
      />
      <div>
        <h3>🚧 1. skipSSROnError true (default)</h3>
        <p>RSC fail → RCC(server) skip without fallback → RCC(browser) success</p>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydrationBoundary
                queries={[
                  {
                    ...query.text(1),
                    queryFn: () => delay(1).then(() => Promise.reject(new Error('error'))),
                  },
                ]}
              >
                <ReactClientComponent ms={1} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <h3>🚧 2. skipSSROnError with fallback</h3>
        <p>RSC fail → RCC(server) skip with fallback → RCC(browser) success</p>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydrationBoundary
                queries={[
                  {
                    ...query.text(2),
                    queryFn: () => delay(2).then(() => Promise.reject(new Error('error'))),
                  },
                ]}
                skipSSROnError={{
                  fallback: <SkipSSROnErrorFallbackBox>skipSSROnError fallback</SkipSSROnErrorFallbackBox>,
                }}
              >
                <ReactClientComponent ms={2} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <h3>🚧 3. skipSSROnError false</h3>
        <p>RSC fail → RCC(server) fail → RCC(browser) success</p>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydrationBoundary
                queries={[
                  {
                    ...query.text(3),
                    queryFn: () => delay(3).then(() => Promise.reject(new Error('error'))),
                  },
                ]}
                skipSSROnError={false}
              >
                <ReactClientComponent ms={3} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <h3>✅ 4. no error (Best Practice)</h3>
        <p>RSC success → RCC(server) cached → RCC(browser) cached</p>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydrationBoundary queries={[query.text(4)]}>
                <ReactClientComponent ms={4} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
      </div>
    </div>
  )
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const EmptyBox = ({ children }: { children: React.ReactNode }) => (
  <div style={{ height: 30, backgroundColor: '#fafafa', border: '1px solid black' }}>{children}</div>
)

const LoadingBox = ({ children }: { children: React.ReactNode }) => (
  <div style={{ backgroundColor: 'yellow' }}>{children}</div>
)
const ErrorFallbackBox = ({ children }: { children: React.ReactNode }) => (
  <div style={{ backgroundColor: 'red' }}>{children}</div>
)
const SkipSSROnErrorFallbackBox = ({ children }: { children: React.ReactNode }) => (
  <div style={{ backgroundColor: 'orange' }}>{children}</div>
)
