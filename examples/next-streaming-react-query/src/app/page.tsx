import { ErrorBoundary, Suspense } from '@suspensive/react'
import { QueriesHydration } from '@suspensive/react-query-5'
import Image from 'next/image'
import { EmptyBox, ErrorFallbackBox, LoadingBox, SkipSSROnErrorFallbackBox } from './_components/Boxes'
import { Buttons } from './_components/Buttons'
import { ReactClientComponent } from './_components/ReactClientComponent'
import { isoFetch, query } from '~/query'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <div>
      <h1 className="text-xl font-bold">Next.js HTML Streaming + React Query</h1>
      <div className="flex items-start justify-between">
        <Image width={160} height={96.25} src="/img/banner.png" alt="" />
        <Buttons />
      </div>
      <div style={{ fontSize: 12 }}>
        <h3 className="text-md font-bold">🚧 1. skipSsrOnError true (default)</h3>
        <p>RSC fail → RCC(server) skip without fallback → RCC(browser) success</p>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydration
                queries={[
                  {
                    ...query.text(1),
                    queryFn: () => isoFetch('/api/text?id=1&error=true').then(() => Promise.reject(new Error('error'))),
                  },
                ]}
              >
                <ReactClientComponent queryKeyId={1} />
              </QueriesHydration>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <h3 className="text-md font-bold">🚧 2. skipSsrOnError with fallback</h3>
        <p>RSC fail → RCC(server) skip with fallback → RCC(browser) success</p>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydration
                queries={[
                  {
                    ...query.text(2),
                    queryFn: () => isoFetch('/api/text?id=1&error=true').then(() => Promise.reject(new Error('error'))),
                  },
                ]}
                skipSsrOnError={{
                  fallback: <SkipSSROnErrorFallbackBox>skipSsrOnError fallback</SkipSSROnErrorFallbackBox>,
                }}
              >
                <ReactClientComponent queryKeyId={2} />
              </QueriesHydration>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <h3 className="text-md font-bold">🚧 3. skipSsrOnError false</h3>
        <p>RSC fail → RCC(server) fail → RCC(browser) success</p>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydration
                queries={[
                  {
                    ...query.text(3),
                    queryFn: () => isoFetch('/api/text?id=1&error=true').then(() => Promise.reject(new Error('error'))),
                  },
                ]}
                skipSsrOnError={false}
              >
                <ReactClientComponent queryKeyId={3} />
              </QueriesHydration>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <h3 className="text-md font-bold">✅ 4. no error (Best Practice)</h3>
        <p>RSC success → RCC(server) cached → RCC(browser) cached</p>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydration queries={[query.text(4)]}>
                <ReactClientComponent queryKeyId={4} />
              </QueriesHydration>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
      </div>
    </div>
  )
}
