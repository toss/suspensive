import { ErrorBoundary, Suspense } from '@suspensive/react'
import { QueriesHydrationBoundary } from '@suspensive/react-query-5'
import Image from 'next/image'
import { ReactClientComponent } from './_components/ReactClientComponent'
import { query } from '~/query'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <div>
      page
      <h1>Title</h1>
      <Image
        height={500}
        width={500}
        src="https://raw.githubusercontent.com/toss/suspensive/main/assets/readme_main.svg"
        alt=""
      />
      <div>
        <ErrorBoundary fallback={<div>error fallback</div>}>
          <Suspense fallback={<div>loading...</div>}>
            <QueriesHydrationBoundary queries={[query.text(200), query.text(1000)]}>
              <ReactClientComponent ms={200} />
            </QueriesHydrationBoundary>
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary fallback={<div>error fallback</div>}>
          <Suspense fallback={<div>loading...</div>}>
            <QueriesHydrationBoundary queries={[query.text(100)]}>
              <ReactClientComponent ms={100} />
            </QueriesHydrationBoundary>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}
