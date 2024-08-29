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
    ;() => (
      <AtomValue atom={countAtom}>
        {(value) => {
          const valueOfJotai = useAtomValue(countAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    )
    ;() => (
      <AtomValue atom={readOnlyCountAtom}>
        {(value) => {
          const valueOfJotai = useAtomValue(readOnlyCountAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    )
    ;() => (
      <AtomValue atom={writeOnlyCountAtom}>
        {(value) => {
          const valueOfJotai = useAtomValue(writeOnlyCountAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    )
    ;() => (
      <AtomValue atom={asyncAtom}>
        {(value) => {
          const valueOfJotai = useAtomValue(asyncAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    )
    ;() => (
      <AtomValue atom={asyncIncrementAtom}>
        {(value) => {
          const valueOfJotai = useAtomValue(asyncIncrementAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    )
    ;() => (
      <AtomValue atom={loadableAtom}>
        {(value) => {
          const valueOfJotai = useAtomValue(loadableAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    )

    expectTypeOf(<AtomValue atom={countAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<AtomValue atom={countAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<AtomValue atom={readOnlyCountAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<AtomValue atom={readOnlyCountAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<AtomValue atom={writeOnlyCountAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<AtomValue atom={writeOnlyCountAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<AtomValue atom={asyncAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<AtomValue atom={asyncAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<AtomValue atom={asyncIncrementAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<AtomValue atom={asyncIncrementAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<AtomValue atom={loadableAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<AtomValue atom={loadableAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
  })
})
