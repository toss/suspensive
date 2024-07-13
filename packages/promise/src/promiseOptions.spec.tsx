import { FALLBACK, TEXT } from '@suspensive/test-utils'
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { PromiseCache } from './PromiseCache'
import { PromiseCacheProvider } from './PromiseCacheProvider'
import { promiseOptions } from './promiseOptions'
import { SuspensePromise } from './SuspensePromise'
import { useSuspensePromise } from './useSuspensePromise'

const key = (id: number) => ['key', id] as const

const options = promiseOptions({ promiseKey: key(1), promiseFn: () => Promise.resolve(TEXT) })

describe('promiseOptions', () => {
  let promiseCache: PromiseCache

  beforeEach(() => {
    promiseCache = new PromiseCache()
  })

  it('should be used with SuspensePromise', async () => {
    render(
      <PromiseCacheProvider cache={promiseCache}>
        <Suspense fallback={FALLBACK}>
          <SuspensePromise options={options}>{({ data }) => <>{data}</>}</SuspensePromise>
        </Suspense>
      </PromiseCacheProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })

  it('should be used with useSuspensePromise', async () => {
    const SuspensePromiseComponent = () => {
      const resolvedData = useSuspensePromise(options)

      return <>{resolvedData.data}</>
    }

    render(
      <PromiseCacheProvider cache={promiseCache}>
        <Suspense fallback={FALLBACK}>
          <SuspensePromiseComponent />
        </Suspense>
      </PromiseCacheProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
