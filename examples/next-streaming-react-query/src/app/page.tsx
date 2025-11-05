import { ErrorBoundary, Suspense } from '@suspensive/react'
import { QueriesHydrationBoundary } from '@suspensive/react-query-5'
import Image from 'next/image'
import { ReactClientComponent } from './_components/ReactClientComponent'
import { query } from '~/query'

export const dynamic = 'force-dynamic'

const LoadingBox = ({ children }: { children: React.ReactNode }) => (
  <div style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: 'yellow' }}>{children}</div>
)
const ErrorFallbackBox = ({ children }: { children: React.ReactNode }) => (
  <div style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: 'red' }}>{children}</div>
)
const SkipSSROnErrorFallbackBox = ({ children }: { children: React.ReactNode }) => (
  <div style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: 'green' }}>{children}</div>
)

export default function Page() {
  return (
    <div>
      page
      <h1>Title</h1>
      <Image
        height={300}
        width={300}
        src="https://raw.githubusercontent.com/toss/suspensive/main/assets/readme_main.svg"
        alt=""
      />
      <div>
        <h3>1. skipSSROnError true (default)</h3>
        <div style={{ height: 30, backgroundColor: 'grey' }}>
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
        </div>
        <h3>2. skipSSROnError with fallback</h3>
        <div style={{ height: 30, backgroundColor: 'grey' }}>
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
        </div>
        <h3>3. skipSSROnError false</h3>
        <div style={{ height: 30, backgroundColor: 'grey' }}>
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
        </div>
        <h3>4. no error</h3>
        <div style={{ height: 30, backgroundColor: 'grey' }}>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydrationBoundary queries={[query.text(4)]}>
                <ReactClientComponent ms={4} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
