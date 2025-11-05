import { ErrorBoundary, Suspense } from '@suspensive/react'
import { QueriesHydrationBoundary } from '@suspensive/react-query-5'
import Image from 'next/image'
import { Buttons } from './_components/Buttons'
import { ReactClientComponent } from './_components/ReactClientComponent'
import { query } from '~/query'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Next.js HTML Streaming + React Query</h1>
      <div className="flex items-start justify-between">
        <Image
          height={200}
          width={200}
          src="https://raw.githubusercontent.com/toss/suspensive/main/assets/readme_main.svg"
          alt=""
        />
        <Buttons />
      </div>
      <div style={{ fontSize: 12 }}>
        <h3 className="text-lg font-bold">🚧 1. skipSsrOnError true (default)</h3>
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
                <ReactClientComponent queryKeyId={1} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <h3 className="text-lg font-bold">🚧 2. skipSsrOnError with fallback</h3>
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
                skipSsrOnError={{
                  fallback: <SkipSSROnErrorFallbackBox>skipSsrOnError fallback</SkipSSROnErrorFallbackBox>,
                }}
              >
                <ReactClientComponent queryKeyId={2} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <h3 className="text-lg font-bold">🚧 3. skipSsrOnError false</h3>
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
                skipSsrOnError={false}
              >
                <ReactClientComponent queryKeyId={3} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <h3 className="text-lg font-bold">✅ 4. no error (Best Practice)</h3>
        <p>RSC success → RCC(server) cached → RCC(browser) cached</p>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydrationBoundary queries={[query.text(4)]}>
                <ReactClientComponent queryKeyId={4} />
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
  <div className="h-16 border border-gray-900 bg-gray-100">{children}</div>
)

const LoadingBox = ({ children }: { children: React.ReactNode }) => <div className="bg-yellow-500">{children}</div>
const ErrorFallbackBox = ({ children }: { children: React.ReactNode }) => <div className="bg-red-500">{children}</div>
const SkipSSROnErrorFallbackBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-orange-500">{children}</div>
)
