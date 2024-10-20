import { atom, useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import type { ReactNode } from 'react'
import { AtomValue } from './AtomValue'

const countAtom = atom(0)
const readOnlyCountAtom = atom((get) => get(countAtom))
const writeOnlyCountAtom = atom(null, (get, set) => set(countAtom, get(countAtom) + 1))
const asyncAtom = atom(async () => Promise.resolve('string'))
// eslint-disable-next-line @typescript-eslint/require-await
const asyncIncrementAtom = atom(null, async (get, set) => {
  set(countAtom, get(countAtom) + 1)
})
const loadableAtom = loadable(asyncAtom)

describe('<AtomValue/>', () => {
  it('type check', () => {
    ;(() => (
      <AtomValue atom={countAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useAtomValue(countAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    ))()
    ;(() => (
      <AtomValue atom={readOnlyCountAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useAtomValue(readOnlyCountAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    ))()
    ;(() => (
      <AtomValue atom={writeOnlyCountAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useAtomValue(writeOnlyCountAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    ))()
    ;(() => (
      <AtomValue atom={asyncAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useAtomValue(asyncAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    ))()
    ;(() => (
      <AtomValue atom={asyncIncrementAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useAtomValue(asyncIncrementAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    ))()
    ;(() => (
      <AtomValue atom={loadableAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useAtomValue(loadableAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    ))()

    expectTypeOf(<AtomValue atom={countAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<AtomValue atom={countAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<AtomValue atom={readOnlyCountAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<AtomValue atom={readOnlyCountAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<AtomValue atom={writeOnlyCountAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<AtomValue atom={writeOnlyCountAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<AtomValue atom={asyncAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<AtomValue atom={asyncAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<AtomValue atom={asyncIncrementAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<AtomValue atom={asyncIncrementAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<AtomValue atom={loadableAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<AtomValue atom={loadableAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
  })
})
