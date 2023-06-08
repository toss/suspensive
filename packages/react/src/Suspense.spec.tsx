import { render, screen, waitFor } from '@testing-library/react'
import { Suspense } from './Suspense'

const ms = 1000
const TEXT = 'Child'
const FALLBACK = 'Fallback'

const Throw = () => {
  throw new Promise((resolve) => resolve('resolved'))
}

describe('Suspense', () => {
  let needThrow = true
  beforeEach(() => {
    needThrow = true
  })
  const ThrowDuring = (props: { ms: number }) => {
    if (needThrow) {
      throw new Promise((resolve) => setTimeout(() => resolve('resolved'), props.ms))
    }
    return <></>
  }

  it('should render the children if nothing to suspend', async () => {
    render(<Suspense fallback={FALLBACK}>{TEXT}</Suspense>)
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })
  it('should render the fallback if something to suspend in children', async () => {
    render(
      <Suspense fallback={FALLBACK}>
        {TEXT}
        <Throw />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })
  it('should render the children after the suspense', async () => {
    jest.useFakeTimers()
    render(
      <Suspense>
        {TEXT}
        <ThrowDuring ms={ms} />
      </Suspense>
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    needThrow = false
    jest.advanceTimersByTime(ms)
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
  it('.CSROnly should render the children after the suspense', async () => {
    jest.useFakeTimers()
    render(
      <Suspense.CSROnly fallback={FALLBACK}>
        {TEXT}
        <ThrowDuring ms={ms} />
      </Suspense.CSROnly>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    needThrow = false
    jest.advanceTimersByTime(ms)
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
  it('.CSROnly should render the children if nothing to suspend in children', async () => {
    render(<Suspense.CSROnly fallback={FALLBACK}>{TEXT}</Suspense.CSROnly>)
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
})
