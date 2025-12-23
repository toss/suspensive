import { act, fireEvent, render, screen } from '@testing-library/react'
import { atom, createStore } from 'jotai'
import { Provider } from 'jotai/react'
import { Suspense } from 'react'
import { vi } from 'vitest'
import { Atom } from './Atom'
import { AtomValue } from './AtomValue'
import { HydrateAtoms } from './HydrateAtoms'
import { sleep } from './test-utils'

describe('<HydrateAtoms />', () => {
  beforeEach(() => vi.useFakeTimers())

  afterEach(() => vi.useRealTimers())

  it('should hydrate atom values from atomValues prop', () => {
    const countAtom = atom(0)
    const nameAtom = atom('')

    render(
      <HydrateAtoms
        atomValues={[
          [countAtom, 10],
          [nameAtom, 'test'],
        ]}
      >
        <AtomValue atom={countAtom}>{(count) => <span>count: {count}</span>}</AtomValue>
        <AtomValue atom={nameAtom}>{(name) => <span>name: {name}</span>}</AtomValue>
      </HydrateAtoms>
    )

    expect(screen.getByText('count: 10')).toBeInTheDocument()
    expect(screen.getByText('name: test')).toBeInTheDocument()
  })

  it('should hydrate union type atoms with as const', () => {
    const countAtom = atom(0)
    const statusAtom = atom<'pending' | 'fulfilled'>('pending')

    render(
      <HydrateAtoms
        atomValues={
          [
            [countAtom, 10],
            [statusAtom, 'fulfilled'],
          ] as const
        }
      >
        <AtomValue atom={countAtom}>{(count) => <span>count: {count}</span>}</AtomValue>
        <AtomValue atom={statusAtom}>{(status) => <span>status: {status}</span>}</AtomValue>
      </HydrateAtoms>
    )

    expect(screen.getByText('count: 10')).toBeInTheDocument()
    expect(screen.getByText('status: fulfilled')).toBeInTheDocument()
  })

  it('should accept Map as atomValues', () => {
    const countAtom = atom(0)
    const nameAtom = atom('')

    const atomValuesMap = new Map<typeof countAtom | typeof nameAtom, number | string>([
      [countAtom, 20],
      [nameAtom, 'from map'],
    ])

    render(
      <HydrateAtoms atomValues={atomValuesMap}>
        <AtomValue atom={countAtom}>{(count) => <span>count: {count}</span>}</AtomValue>
        <AtomValue atom={nameAtom}>{(name) => <span>name: {name}</span>}</AtomValue>
      </HydrateAtoms>
    )

    expect(screen.getByText('count: 20')).toBeInTheDocument()
    expect(screen.getByText('name: from map')).toBeInTheDocument()
  })

  it('should hydrate object type atom', () => {
    const userAtom = atom({ name: '', age: 0 })

    render(
      <HydrateAtoms atomValues={[[userAtom, { name: 'john', age: 30 }]]}>
        <AtomValue atom={userAtom}>
          {(user) => (
            <div>
              <span>name: {user.name}</span>
              <span>age: {user.age}</span>
            </div>
          )}
        </AtomValue>
      </HydrateAtoms>
    )

    expect(screen.getByText('name: john')).toBeInTheDocument()
    expect(screen.getByText('age: 30')).toBeInTheDocument()
  })

  it('should hydrate writable atom with multiple args', () => {
    const baseAtom = atom(0)
    const writableAtom = atom(
      (get) => get(baseAtom),
      (_get, set, first: number, second: number) => {
        set(baseAtom, first + second)
      }
    )

    render(
      <HydrateAtoms atomValues={[[writableAtom, 10, 20]]}>
        <AtomValue atom={writableAtom}>{(value) => <span>value: {value}</span>}</AtomValue>
      </HydrateAtoms>
    )

    expect(screen.getByText('value: 30')).toBeInTheDocument()
  })

  it('should work with derived atoms', () => {
    const countAtom = atom(0)
    const doubleAtom = atom((get) => get(countAtom) * 2)

    render(
      <HydrateAtoms atomValues={[[countAtom, 21]]}>
        <AtomValue atom={countAtom}>{(count) => <span>count: {count}</span>}</AtomValue>
        <AtomValue atom={doubleAtom}>{(double) => <span>double: {double}</span>}</AtomValue>
      </HydrateAtoms>
    )

    expect(screen.getByText('count: 21')).toBeInTheDocument()
    expect(screen.getByText('double: 42')).toBeInTheDocument()
  })

  it('should respect onMount', () => {
    const countAtom = atom(0)
    const onMountFn = vi.fn()
    countAtom.onMount = onMountFn

    render(
      <HydrateAtoms atomValues={[[countAtom, 42]]}>
        <AtomValue atom={countAtom}>{(count) => <div>count: {count}</div>}</AtomValue>
      </HydrateAtoms>
    )

    expect(screen.getByText('count: 42')).toBeInTheDocument()
    expect(onMountFn).toHaveBeenCalledTimes(1)
  })

  it('should accept options with custom store', () => {
    const countAtom = atom(0)
    const customStore = createStore()

    render(
      <Provider store={customStore}>
        <HydrateAtoms atomValues={[[countAtom, 100]]} options={{ store: customStore }}>
          <AtomValue atom={countAtom}>{(count) => <span>count: {count}</span>}</AtomValue>
        </HydrateAtoms>
      </Provider>
    )

    expect(screen.getByText('count: 100')).toBeInTheDocument()
  })

  it('should re-hydrate when dangerouslyForceHydrate is true', () => {
    const countAtom = atom(0)
    const customStore = createStore()

    const { rerender } = render(
      <Provider store={customStore}>
        <HydrateAtoms atomValues={[[countAtom, 10]]} options={{ store: customStore }}>
          <AtomValue atom={countAtom}>{(count) => <span>count: {count}</span>}</AtomValue>
        </HydrateAtoms>
      </Provider>
    )

    expect(screen.getByText('count: 10')).toBeInTheDocument()

    rerender(
      <Provider store={customStore}>
        <HydrateAtoms atomValues={[[countAtom, 20]]} options={{ store: customStore, dangerouslyForceHydrate: true }}>
          <AtomValue atom={countAtom}>{(count) => <span>count: {count}</span>}</AtomValue>
        </HydrateAtoms>
      </Provider>
    )

    expect(screen.getByText('count: 20')).toBeInTheDocument()
  })

  it('should not re-hydrate by default', () => {
    const countAtom = atom(0)
    const customStore = createStore()

    const { rerender } = render(
      <Provider store={customStore}>
        <HydrateAtoms atomValues={[[countAtom, 10]]} options={{ store: customStore }}>
          <AtomValue atom={countAtom}>{(count) => <span>count: {count}</span>}</AtomValue>
        </HydrateAtoms>
      </Provider>
    )

    expect(screen.getByText('count: 10')).toBeInTheDocument()

    rerender(
      <Provider store={customStore}>
        <HydrateAtoms atomValues={[[countAtom, 99]]} options={{ store: customStore }}>
          <AtomValue atom={countAtom}>{(count) => <span>count: {count}</span>}</AtomValue>
        </HydrateAtoms>
      </Provider>
    )

    expect(screen.getByText('count: 10')).toBeInTheDocument()
  })

  it('should work with Suspense when async atom uses hydrated value', async () => {
    const userAtom = atom({ name: '', age: 0 })
    const derivedUserAtom = atom(async (get) => {
      const user = get(userAtom)
      await sleep(100)
      return { name: user.name, age: user.age + 1 }
    })

    await act(() =>
      render(
        <HydrateAtoms atomValues={[[userAtom, { name: 'John', age: 25 }]]}>
          <Suspense fallback={<span>loading...</span>}>
            <Atom atom={derivedUserAtom}>
              {([derivedUser]) => (
                <span>
                  name: {derivedUser.name}, age: {derivedUser.age}
                </span>
              )}
            </Atom>
            <Atom atom={userAtom}>
              {([user, setUser]) => (
                <button type="button" onClick={() => setUser({ ...user, age: user.age + 10 })}>
                  add 10
                </button>
              )}
            </Atom>
          </Suspense>
        </HydrateAtoms>
      )
    )

    expect(screen.getByText('loading...')).toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(screen.getByText('name: John, age: 26')).toBeInTheDocument()

    await act(() => fireEvent.click(screen.getByText('add 10')))
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(screen.getByText('name: John, age: 36')).toBeInTheDocument()
  })
})
