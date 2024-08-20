import { Suspense } from '@suspensive/react'
import { TEXT } from '@suspensive/utils'
import { render, screen } from '@testing-library/react'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { CacheProvider } from './CacheProvider'
import { Read } from './Read'

const successCache = (id: number) =>
  cacheOptions({
    cacheKey: ['key', id] as const,
    cacheFn: () => Promise.resolve(TEXT),
  })

describe('<Read />', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
  })

  it('should render child component with data from useRead hook', async () => {
    render(
      <CacheProvider cache={cache}>
        <Suspense fallback="Loading...">
          <Read {...successCache(1)}>{(cached) => <>{cached.data}</>}</Read>
        </Suspense>
      </CacheProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
