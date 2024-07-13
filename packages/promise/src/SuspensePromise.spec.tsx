import { Suspense } from '@suspensive/react'
import { TEXT } from '@suspensive/test-utils'
import { render, screen } from '@testing-library/react'
import { PromiseCache } from './PromiseCache'
import { PromiseCacheProvider } from './PromiseCacheProvider'
import { SuspensePromise } from './SuspensePromise'

const key = (id: number) => ['key', id] as const

describe('<SuspensePromise />', () => {
  let promiseCache: PromiseCache

  beforeEach(() => {
    promiseCache = new PromiseCache()
  })

  it('should render child component with data from useSuspensePromise hook', async () => {
    render(
      <PromiseCacheProvider cache={promiseCache}>
        <Suspense fallback="Loading...">
          <SuspensePromise options={{ promiseKey: key(1), promiseFn: () => Promise.resolve(TEXT) }}>
            {({ data }) => <>{data}</>}
          </SuspensePromise>
        </Suspense>
      </PromiseCacheProvider>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
