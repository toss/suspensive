import { FALLBACK, TEXT } from '@suspensive/test-utils'
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { Await } from './Await'
import { awaitOptions } from './awaitOptions'

const key = (id: number) => ['key', id] as const

describe('awaitOptions', () => {
  it('should be used with Await', async () => {
    const options = awaitOptions({ key: key(1), fn: () => Promise.resolve(TEXT) })

    render(
      <Suspense fallback={FALLBACK}>
        <Await options={options}>{({ data }) => <>{data}</>}</Await>
      </Suspense>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
