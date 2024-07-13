import { FALLBACK, TEXT } from '@suspensive/test-utils'
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { CacheProvider } from './CacheProvider'
import { SuspenseCache } from './SuspenseCache'
import { useSuspenseCache } from './useSuspenseCache'

const key = (id: number) => ['key', id] as const

const options = cacheOptions({ cacheKey: key(1), cacheFn: () => Promise.resolve(TEXT) })

describe('cacheOptions', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
  })

  it('should be used with SuspenseCache', async () => {
    render(
      <CacheProvider cache={cache}>
        <Suspense fallback={FALLBACK}>
          <SuspenseCache cacheKey={options.cacheKey} cacheFn={options.cacheFn}>
            {({ data }) => <>{data}</>}
          </SuspenseCache>
        </Suspense>
      </CacheProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })

  it('should be used with useSuspenseCache', async () => {
    const SuspenseCacheComponent = () => {
      const resolvedData = useSuspenseCache(options)

      return <>{resolvedData.data}</>
    }

    render(
      <CacheProvider cache={cache}>
        <Suspense fallback={FALLBACK}>
          <SuspenseCacheComponent />
        </Suspense>
      </CacheProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
