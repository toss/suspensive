import { act, fireEvent, render, screen } from '@testing-library/react'
import { atom } from 'jotai'
import { Suspense } from 'react'
import { Atom } from './Atom'
import type { SetAtom } from './utility-types'

describe('<Atom />', () => {
  it('should render with a PrimitiveAtom and update value', () => {
    const countAtom = atom(0)

    const { getByText } = render(
      <Atom atom={countAtom}>
        {([count, setCount]) => (
          <>
            <div>count: {count}</div>
            <button type="button" onClick={() => setCount(count + 1)}>
              Increment
            </button>
          </>
        )}
      </Atom>
    )

    expect(getByText('count: 0')).toBeInTheDocument()
    fireEvent.click(getByText('Increment'))
    expect(getByText('count: 1')).toBeInTheDocument()
  })

  it('should render with a WritableAtom with custom args and call set', () => {
    const log = vi.fn()

    const baseAtom = atom(0)
    const writeAtom = atom(null, (_get, set, value: number) => {
      log(value)
      set(baseAtom, value)
    })

    const { getByText } = render(
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

    fireEvent.click(getByText('Set 5'))
    expect(log).toHaveBeenCalledWith(5)
  })

  it('should render with a read-only atom and setAtom throws an error when called', () => {
    const testAtom = atom(() => 123)

    render(
      <Atom atom={testAtom}>
        {([value, setValue]) => {
          expect(value).toBe(123)
          expect(setValue).toMatchInlineSnapshot('[Function]')
          expect(() => {
            ;(setValue as SetAtom<[value: number], void>)(246)
          }).toThrowError('not writable atom')

          return <div>value: {value}</div>
        }}
      </Atom>
    )

    expect(screen.getByText('value: 123')).toBeInTheDocument()
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
    expect(await screen.findByText('value: hello')).toBeInTheDocument()
  })

  it('should read and update an async atom using Suspense with proper loading state', async () => {
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
    expect(await screen.findByText('value: 0')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Set to 100'))
    expect(await screen.findByText('loading...')).toBeInTheDocument()
    expect(await screen.findByText('value: 100')).toBeInTheDocument()
  })
})
