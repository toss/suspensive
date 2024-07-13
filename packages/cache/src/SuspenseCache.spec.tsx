import { Suspense } from '@suspensive/react'
import { TEXT } from '@suspensive/test-utils'
import { render, screen } from '@testing-library/react'
import { Cache } from './Cache'
import { CacheProvider } from './CacheProvider'
import { SuspenseCache } from './SuspenseCache'

const key = (id: number) => ['key', id] as const

describe('<SuspenseCache />', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
  })

  it('should render child component with data from useSuspenseCache hook', async () => {
    render(
      <CacheProvider cache={cache}>
        <Suspense fallback="Loading...">
          <SuspenseCache options={{ cacheKey: key(1), cacheFn: () => Promise.resolve(TEXT) }}>
            {({ data }) => <>{data}</>}
          </SuspenseCache>
        </Suspense>
      </CacheProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
