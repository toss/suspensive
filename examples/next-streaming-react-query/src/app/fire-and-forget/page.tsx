import { ErrorBoundary, Suspense } from '@suspensive/react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import Image from 'next/image'
import { EmptyBox, ErrorFallbackBox, LoadingBox } from '../_components/Boxes'
import { Buttons } from '../_components/Buttons'
import { ReactClientComponent } from '../_components/ReactClientComponent'
import { getQueryClient } from '../get-query-client'
import { query } from '~/query'

export const dynamic = 'force-dynamic'

export default function Page() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(query.text(11))
  void queryClient.prefetchQuery(query.text(12))
  void queryClient.prefetchQuery(query.text(13))
  void queryClient.prefetchQuery(query.text(14))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <h1 className="text-xl font-bold">Next.js HTML Streaming + React Query</h1>
        <div className="flex items-start justify-between">
          <Image width={160} height={96.25} src="/img/banner.png" alt="" />
          <Buttons />
        </div>
        <div style={{ fontSize: 12 }}>
          <EmptyBox>
            <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
              <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
                <ReactClientComponent queryKeyId={11} />
              </Suspense>
            </ErrorBoundary>
          </EmptyBox>
          <EmptyBox>
            <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
              <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
                <ReactClientComponent queryKeyId={12} />
              </Suspense>
            </ErrorBoundary>
          </EmptyBox>
          <EmptyBox>
            <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
              <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
                <ReactClientComponent queryKeyId={13} />
              </Suspense>
            </ErrorBoundary>
          </EmptyBox>
          <EmptyBox>
            <ErrorBoundary fallback={<ErrorFallbackBox>error fallback</ErrorFallbackBox>}>
              <Suspense fallback={<LoadingBox>loading...</LoadingBox>}>
                <ReactClientComponent queryKeyId={14} />
              </Suspense>
            </ErrorBoundary>
          </EmptyBox>
        </div>
      </div>
    </HydrationBoundary>
  )
}
