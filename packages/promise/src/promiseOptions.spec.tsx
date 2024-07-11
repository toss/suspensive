import { FALLBACK, TEXT } from '@suspensive/test-utils'
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { promiseOptions } from './promiseOptions'
import { SuspensePromise } from './SuspensePromise'
import { useSuspensePromise } from './useSuspensePromise'

const key = (id: number) => ['key', id] as const

const options = promiseOptions({ key: key(1), fn: () => Promise.resolve(TEXT) })

describe('promiseOptions', () => {
  it('should be used with SuspensePromise', async () => {
    render(
      <Suspense fallback={FALLBACK}>
        <SuspensePromise options={options}>{({ data }) => <>{data}</>}</SuspensePromise>
      </Suspense>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })

  it('should be used with useSuspensePromise', async () => {
    const SuspensePromiseComponent = () => {
      const resolvedData = useSuspensePromise(options)

      return <>{resolvedData.data}</>
    }

    render(
      <Suspense fallback={FALLBACK}>
        <SuspensePromiseComponent />
      </Suspense>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})
