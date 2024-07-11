import { Suspense } from '@suspensive/react'
import { TEXT } from '@suspensive/test-utils'
import { render, screen } from '@testing-library/react'
import { SuspensePromise } from './SuspensePromise'

const key = (id: number) => ['key', id] as const

describe('<SuspensePromise />', () => {
  it('should render child component with data from useSuspensePromise hook', async () => {
    render(
      <Suspense fallback="Loading...">
        <SuspensePromise options={{ key: key(1), fn: () => Promise.resolve(TEXT) }}>
          {({ data }) => <>{data}</>}
        </SuspensePromise>
      </Suspense>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
