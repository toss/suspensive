import { act, render, screen } from '@testing-library/react'
import { atom, createStore } from 'jotai'
import { Suspense } from 'react'
import { AtomValue } from './AtomValue'
import { sleep } from './test-utils'

describe('<AtomValue />', () => {
  beforeEach(() => vi.useFakeTimers())

  afterEach(() => vi.useRealTimers())

  it('should render with a primitive atom', () => {
    const countAtom = atom(10)

    render(<AtomValue atom={countAtom}>{(count) => <div>count: {count}</div>}</AtomValue>)

    expect(screen.getByText('count: 10')).toBeInTheDocument()
  })

  it('should render with a readable derived atom', () => {
    const baseAtom = atom(10)
    const derivedAtom = atom((get) => get(baseAtom) * 2)

    render(<AtomValue atom={derivedAtom}>{(value) => <div>value: {value}</div>}</AtomValue>)

    expect(screen.getByText('value: 20')).toBeInTheDocument()
  })

  it('should call children with correct value', () => {
    const testAtom = atom('abc')
    const children = vi.fn(() => <div>Test</div>)

    render(<AtomValue atom={testAtom}>{children}</AtomValue>)

    expect(children).toHaveBeenCalledWith('abc')
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should read value from the specified store via options', () => {
    const countAtom = atom(0)
    const myStore = createStore()
    myStore.set(countAtom, 10)

    render(
      <AtomValue atom={countAtom} options={{ store: myStore }}>
        {(count) => <div>count: {count}</div>}
      </AtomValue>
    )

    expect(screen.getByText('count: 10')).toBeInTheDocument()
  })

  it('should isolate state between different stores via options', () => {
    const countAtom = atom(0)
    const storeA = createStore()
    const storeB = createStore()
    storeA.set(countAtom, 10)

    render(
      <>
        <AtomValue atom={countAtom} options={{ store: storeA }}>
          {(count) => <div>storeA: {count}</div>}
        </AtomValue>
        <AtomValue atom={countAtom} options={{ store: storeB }}>
          {(count) => <div>storeB: {count}</div>}
        </AtomValue>
      </>
    )

    expect(screen.getByText('storeA: 10')).toBeInTheDocument()
    expect(screen.getByText('storeB: 0')).toBeInTheDocument()
  })

  it('should render with an async atom and resolve the value', async () => {
    const asyncAtom = atom(async () => {
      await sleep(100)
      return 'hello'
    })

    await act(() =>
      render(
        <Suspense fallback={<div>loading...</div>}>
          <AtomValue atom={asyncAtom}>{(value) => <div>value: {value}</div>}</AtomValue>
        </Suspense>
      )
    )

    expect(screen.getByText('loading...')).toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(screen.getByText('value: hello')).toBeInTheDocument()
  })
})
