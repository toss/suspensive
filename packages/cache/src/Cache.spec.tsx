import { Suspense } from '@suspensive/react'
import { TEXT } from '@suspensive/utils'
import { render, screen } from '@testing-library/react'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { CacheStore } from './CacheStore'
import { CacheStoreProvider } from './CacheStoreProvider'

const cache = (id: number) =>
  cacheOptions({
    cacheKey: ['key', id] as const,
    cacheFn: () => Promise.resolve(TEXT),
  })

describe('<Cache />', () => {
  let cacheStore: CacheStore

  beforeEach(() => {
    cacheStore = new CacheStore()
  })

  it('should render child component with data from useCache hook', async () => {
    render(
      <CacheStoreProvider store={cacheStore}>
        <Suspense fallback="Loading...">
          <Cache {...cache(1)}>{(cached) => <>{cached.data}</>}</Cache>
        </Suspense>
      </CacheStoreProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
