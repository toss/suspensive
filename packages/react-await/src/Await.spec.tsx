import { Suspense } from '@suspensive/react'
import { TEXT } from '@suspensive/test-utils'
import { render, screen } from '@testing-library/react'
import { Await } from './Await'

const key = (id: number) => ['key', id] as const

describe('<Await />', () => {
  it('should render child component with data from useAwait hook', async () => {
    render(
      <Suspense fallback="Loading...">
        <Await options={{ key: key(1), fn: () => Promise.resolve(TEXT) }}>{({ data }) => <>{data}</>}</Await>
      </Suspense>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
