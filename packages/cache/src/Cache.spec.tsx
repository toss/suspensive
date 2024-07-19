import { Suspense } from '@suspensive/react'
import { TEXT } from '@suspensive/utils'
import { render, screen } from '@testing-library/react'
import { Cache } from './Cache'
import { CacheStore } from './CacheStore'
import { CacheStoreProvider } from './CacheStoreProvider'

const key = (id: number) => ['key', id] as const

describe('<Cache />', () => {
  let cacheStore: CacheStore

  beforeEach(() => {
    cacheStore = new CacheStore()
  })

  it('should render child component with data from useCache hook', async () => {
    render(
      <CacheStoreProvider store={cacheStore}>
        <Suspense fallback="Loading...">
          <Cache cacheKey={key(1)} cacheFn={() => Promise.resolve(TEXT)}>
            {(cached) => <>{cached.data}</>}
          </Cache>
        </Suspense>
      </CacheStoreProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
