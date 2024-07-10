import { FALLBACK, TEXT } from '@suspensive/test-utils'
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { Await, useAwait } from './Await'
import { awaitOptions } from './awaitOptions'

const key = (id: number) => ['key', id] as const

const options = awaitOptions({ key: key(1), fn: () => Promise.resolve(TEXT) })

describe('awaitOptions', () => {
  it('should be used with Await', async () => {
    render(
      <Suspense fallback={FALLBACK}>
        <Await options={options}>{({ data }) => <>{data}</>}</Await>
      </Suspense>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })

  it('should be used with useAwait', async () => {
    const AwaitedComponent = () => {
      return <>{useAwait(options).data}</>
    }

    render(
      <Suspense fallback={FALLBACK}>
        <AwaitedComponent />
      </Suspense>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
