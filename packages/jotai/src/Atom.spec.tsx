import { act, fireEvent, render, screen } from '@testing-library/react'
import { atom } from 'jotai'
import { Suspense } from 'react'
import { Atom } from './Atom'

describe('<Atom />', () => {
  it('should render with a primitive writable atom and update its value', () => {
    const countAtom = atom(0)

    render(
      <Atom atom={countAtom}>
        {([count, setCount]) => (
          <>
            <div>count: {count}</div>
            <button type="button" onClick={() => setCount(10)}>
              Set 10
            </button>
            <button type="button" onClick={() => setCount((prevCount) => prevCount + 10)}>
              Plus 10
            </button>
          </>
        )}
      </Atom>
    )

    expect(screen.getByText('count: 0')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Set 10'))
    expect(screen.getByText('count: 10')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Plus 10'))
    expect(screen.getByText('count: 20')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Plus 10'))
    expect(screen.getByText('count: 30')).toBeInTheDocument()
  })

  it('should render with a WritableAtom with custom args and call set', () => {
    const log = vi.fn()

    const baseAtom = atom(0)
    const writeAtom = atom(null, (_get, set, value: number) => {
      log(value)
      set(baseAtom, value)
    })

    render(
      <Atom atom={writeAtom}>
        {([value, setValue]) => (
          <>
            <div>value: {value}</div>
            <button type="button" onClick={() => setValue(5)}>
              Set 5
            </button>
          </>
        )}
      </Atom>
    )

    fireEvent.click(screen.getByText('Set 5'))
    expect(log).toHaveBeenCalledWith(5)
  })

  it('should render with a writable derived atom and update base atom', () => {
    const baseAtom = atom(100)
    const derivedAtom = atom(
      (get) => get(baseAtom),
      (get, set, value: number) => {
        set(baseAtom, get(baseAtom) + value)
      }
    )

    render(
      <Atom atom={derivedAtom}>
        {([value, setValue]) => (
          <div>
            <div>value: {value}</div>
            <button type="button" onClick={() => setValue(200)}>
              Set to 300
            </button>
          </div>
        )}
      </Atom>
    )

    expect(screen.getByText('value: 100')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Set to 300'))
    expect(screen.getByText('value: 300')).toBeInTheDocument()
  })

  it('should call children render prop with correct values', () => {
    const testAtom = atom(123)
    const children = vi.fn(() => <div>Test</div>)

    render(<Atom atom={testAtom}>{children}</Atom>)

    expect(children).toHaveBeenCalled()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should read an async atom using Suspense with proper loading state', async () => {
    vi.useFakeTimers()

    const asyncAtom = atom(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return 'hello'
    })

    await act(() =>
      render(
        <Suspense fallback={<div>loading...</div>}>
          <Atom atom={asyncAtom}>{([value]) => <div>value: {value}</div>}</Atom>
        </Suspense>
      )
    )

    expect(screen.getByText('loading...')).toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(100))
    await vi.waitFor(() => expect(screen.getByText('value: hello')).toBeInTheDocument())

    vi.useRealTimers()
  })

  it('should read and update an async atom using Suspense with proper loading state', async () => {
    vi.useFakeTimers()

    const baseAtom = atom(0)
    const asyncReadableAtom = atom(async (get) => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return get(baseAtom)
    })
    const asyncWritableAtom = atom(
      (get) => get(asyncReadableAtom),
      async (_get, set, newValue: number) => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        set(baseAtom, newValue)
      }
    )

    await act(() =>
      render(
        <Suspense fallback={<div>loading...</div>}>
          <Atom atom={asyncWritableAtom}>
            {([value, setValue]) => (
              <>
                <div>value: {value}</div>
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <button type="button" onClick={() => setValue(100)}>
                  Set to 100
                </button>
              </>
            )}
          </Atom>
        </Suspense>
      )
    )

    expect(screen.getByText('loading...')).toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(100))
    await vi.waitFor(() => expect(screen.getByText('value: 0')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Set to 100'))
    await vi.waitFor(() => expect(screen.getByText('loading...')).toBeInTheDocument())
    await act(() => vi.advanceTimersByTimeAsync(100))
    await vi.waitFor(() => expect(screen.getByText('value: 100')).toBeInTheDocument())

    vi.useRealTimers()
  })
})
