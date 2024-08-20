import { FALLBACK, TEXT } from '@suspensive/utils'
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { CacheProvider } from './CacheProvider'
import { Read } from './Read'
import { useRead } from './useRead'

const key = (id: number) => ['key', id] as const

const successCache = () => cacheOptions({ cacheKey: key(1), cacheFn: () => Promise.resolve(TEXT) })

describe('cacheOptions', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
  })

  it('should be used with Read', async () => {
    render(
      <CacheProvider cache={cache}>
        <Suspense fallback={FALLBACK}>
          <Read {...successCache()}>{(cached) => <>{cached.data}</>}</Read>
        </Suspense>
      </CacheProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })

  it('should be used with useRead', async () => {
    const CacheComponent = () => {
      const cached = useRead(successCache())
      return <>{cached.data}</>
    }

    render(
      <CacheProvider cache={cache}>
        <Suspense fallback={FALLBACK}>
          <CacheComponent />
        </Suspense>
      </CacheProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
