import { ErrorBoundary, Suspense } from '@suspensive/react'
import PrefetchBoundary from './_components/PrefetchBoundary'
import { ReactClientComponent } from './_components/ReactClientComponent'
import { query } from '~/query'

export default function page() {
  return (
    <div>
      page
      <h1>Title</h1>
      <img width={500} src="https://raw.githubusercontent.com/toss/suspensive/main/assets/readme_main.svg" alt="" />
      <div>
        <ErrorBoundary fallback={<div>error fallback</div>}>
          <Suspense clientOnly fallback={<div>loading...</div>}>
            <PrefetchBoundary queries={[query.text(1000)]}>
              <ReactClientComponent />
            </PrefetchBoundary>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}
