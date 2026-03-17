import { act, render, screen } from '@testing-library/react'
import { atom } from 'jotai'
import { Suspense } from 'react'
import { ReadAtom } from './ReadAtom'
import { sleep } from './test-utils'

describe('<ReadAtom />', () => {
  beforeEach(() => vi.useFakeTimers())

  afterEach(() => vi.useRealTimers())

  it('should render with a primitive atom', () => {
    const countAtom = atom(10)

    render(<ReadAtom atom={countAtom}>{(count) => <div>count: {count}</div>}</ReadAtom>)

    expect(screen.getByText('count: 10')).toBeInTheDocument()
  })

  it('should render with a readable derived atom', () => {
    const baseAtom = atom(10)
    const derivedAtom = atom((get) => get(baseAtom) * 2)

    render(<ReadAtom atom={derivedAtom}>{(value) => <div>value: {value}</div>}</ReadAtom>)

    expect(screen.getByText('value: 20')).toBeInTheDocument()
  })

  it('should call children with correct value', () => {
    const testAtom = atom('abc')
    const children = vi.fn(() => <div>Test</div>)

    render(<ReadAtom atom={testAtom}>{children}</ReadAtom>)

    expect(children).toHaveBeenCalledWith('abc')
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should render with an async atom and resolve the value', async () => {
    const asyncAtom = atom(async () => {
      await sleep(100)
      return 'hello'
    })

    await act(() =>
      render(
        <Suspense fallback={<div>loading...</div>}>
          <ReadAtom atom={asyncAtom}>{(value) => <div>value: {value}</div>}</ReadAtom>
        </Suspense>
      )
    )

    expect(screen.getByText('loading...')).toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(screen.getByText('value: hello')).toBeInTheDocument()
  })
})
