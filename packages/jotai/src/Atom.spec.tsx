import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
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

  it('should call children render prop with correct values', () => {
    const testAtom = atom(123)
    const children = vi.fn(() => <div>Test</div>)

    render(<Atom atom={testAtom}>{children}</Atom>)

    expect(children).toHaveBeenCalled()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should render with an async atom and show resolved value', async () => {
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
    await waitFor(() => expect(screen.getByText('value: hello')).toBeInTheDocument())
  })
})
