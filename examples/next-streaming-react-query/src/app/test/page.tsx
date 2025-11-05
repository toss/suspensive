import { ErrorBoundary, Suspense } from '@suspensive/react'
import { QueriesHydrationBoundary } from '@suspensive/react-query-5'
import Image from 'next/image'
import { EmptyBox, ErrorFallbackBox, LoadingBox } from '../_components/Boxes'
import { Buttons } from '../_components/Buttons'
import { ReactClientComponent } from '../_components/ReactClientComponent'
import { query } from '~/query'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <div>
      <h1 className="text-xl font-bold">Next.js HTML Streaming + React Query</h1>
      <div className="flex items-start justify-between">
        <Image
          height={160}
          width={160}
          src="https://raw.githubusercontent.com/toss/suspensive/main/assets/readme_main.svg"
          alt=""
        />
        <Buttons />
      </div>
      <div style={{ fontSize: 12 }}>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydrationBoundary queries={[query.text(11)]}>
                <ReactClientComponent queryKeyId={11} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydrationBoundary queries={[query.text(12)]}>
                <ReactClientComponent queryKeyId={12} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydrationBoundary queries={[query.text(13)]}>
                <ReactClientComponent queryKeyId={13} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
        <EmptyBox>
          <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
            <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
              <QueriesHydrationBoundary queries={[query.text(14)]}>
                <ReactClientComponent queryKeyId={14} />
              </QueriesHydrationBoundary>
            </Suspense>
          </ErrorBoundary>
        </EmptyBox>
      </div>
    </div>
  )
}
