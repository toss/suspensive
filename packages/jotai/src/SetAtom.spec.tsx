import { act, fireEvent, render, screen } from '@testing-library/react'
import { atom } from 'jotai'
import { Suspense } from 'react'
import { AtomValue } from './AtomValue'
import { SetAtom } from './SetAtom'

describe('<SetAtom />', () => {
  it('should render with a primitive writable atom and update its value', () => {
    const countAtom = atom(0)

    render(
      <>
        <AtomValue atom={countAtom}>{(count) => <div>count: {count}</div>}</AtomValue>
        <SetAtom atom={countAtom}>
          {(setCount) => (
            <>
              <button type="button" onClick={() => setCount(10)}>
                Set 10
              </button>
              <button type="button" onClick={() => setCount((prevCount) => prevCount + 10)}>
                Plus 10
              </button>
            </>
          )}
        </SetAtom>
      </>
    )

    expect(screen.getByText('count: 0')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Set 10'))
    expect(screen.getByText('count: 10')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Plus 10'))
    expect(screen.getByText('count: 20')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Plus 10'))
    expect(screen.getByText('count: 30')).toBeInTheDocument()
  })

  it('should call custom write logic with arguments', () => {
    const log = vi.fn()

    const baseAtom = atom(0)
    const customWriteAtom = atom(
      (get) => get(baseAtom),
      (_get, set, value: number) => {
        log(value)
        set(baseAtom, value * 2)
      }
    )

    render(
      <>
        <AtomValue atom={baseAtom}>{(value) => <div>base: {value}</div>}</AtomValue>
        <SetAtom atom={customWriteAtom}>
          {(setValue) => (
            <button type="button" onClick={() => setValue(5)}>
              Custom Set
            </button>
          )}
        </SetAtom>
      </>
    )

    fireEvent.click(screen.getByText('Custom Set'))
    expect(log).toHaveBeenCalledWith(5)
    expect(screen.getByText('base: 10')).toBeInTheDocument()
  })

  it('should call children with correct set function', () => {
    const toggleAtom = atom(false)
    const children = vi.fn(() => <div>Test</div>)

    render(<SetAtom atom={toggleAtom}>{children}</SetAtom>)

    expect(children).toHaveBeenCalled()
    expect(screen.getByText('Test')).toBeInTheDocument()
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
          <AtomValue atom={asyncWritableAtom}>{(value) => <div>value: {value}</div>}</AtomValue>
          <SetAtom atom={asyncWritableAtom}>
            {(setValue) => (
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              <button type="button" onClick={() => setValue(100)}>
                Set to 100
              </button>
            )}
          </SetAtom>
        </Suspense>
      )
    )

    expect(screen.getByText('loading...')).toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(screen.getByText('value: 0')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Set to 100'))
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(screen.getByText('loading...')).toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(screen.getByText('value: 100')).toBeInTheDocument()

    vi.useRealTimers()
  })
})
