import { FALLBACK, TEXT } from '@suspensive/utils'
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { CacheStore } from './CacheStore'
import { CacheStoreProvider } from './CacheStoreProvider'
import { useCache } from './useCache'

const key = (id: number) => ['key', id] as const

const cache = () => cacheOptions({ cacheKey: key(1), cacheFn: () => Promise.resolve(TEXT) })

describe('cacheOptions', () => {
  let cacheStore: CacheStore

  beforeEach(() => {
    cacheStore = new CacheStore()
  })

  it('should be used with Cache', async () => {
    render(
      <CacheStoreProvider store={cacheStore}>
        <Suspense fallback={FALLBACK}>
          <Cache {...cache()}>{(cached) => <>{cached.data}</>}</Cache>
        </Suspense>
      </CacheStoreProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })

  it('should be used with useCache', async () => {
    const CacheComponent = () => {
      const cached = useCache(cache())
      return <>{cached.data}</>
    }

    render(
      <CacheStoreProvider store={cacheStore}>
        <Suspense fallback={FALLBACK}>
          <CacheComponent />
        </Suspense>
      </CacheStoreProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
