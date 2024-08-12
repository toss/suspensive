import { atom, useAtom } from 'jotai'
import { loadable } from 'jotai/utils'
import type { ReactNode } from 'react'
import { Atom } from './Atom'

const countAtom = atom(0)
const readOnlyCountAtom = atom((get) => get(countAtom))
const writeOnlyCountAtom = atom(null, (get, set) => set(countAtom, get(countAtom) + 1))
const asyncAtom = atom(async () => Promise.resolve('string'))
const asyncIncrementAtom = atom(null, async (get, set) => {
  set(countAtom, get(countAtom) + 1)
})
const loadableAtom = loadable(asyncAtom)

describe('<Atom/>', () => {
  it('type check', () => {
    ;() => (
      <Atom atom={countAtom}>
        {(result) => {
          const returnOfJotai = useAtom(countAtom)
          expectTypeOf(result).toEqualTypeOf<typeof returnOfJotai>()
          return <></>
        }}
      </Atom>
    )
    ;() => (
      <Atom atom={readOnlyCountAtom}>
        {(result) => {
          const returnOfJotai = useAtom(readOnlyCountAtom)
          expectTypeOf(result).toEqualTypeOf<typeof returnOfJotai>()
          return <></>
        }}
      </Atom>
    )
    ;() => (
      <Atom atom={writeOnlyCountAtom}>
        {(result) => {
          const returnOfJotai = useAtom(writeOnlyCountAtom)
          expectTypeOf(result).toEqualTypeOf<typeof returnOfJotai>()
          return <></>
        }}
      </Atom>
    )
    ;() => (
      <Atom atom={asyncAtom}>
        {(result) => {
          const returnOfJotai = useAtom(asyncAtom)
          expectTypeOf(result).toEqualTypeOf<typeof returnOfJotai>()
          return <></>
        }}
      </Atom>
    )
    ;() => (
      <Atom atom={asyncIncrementAtom}>
        {(result) => {
          const returnOfJotai = useAtom(asyncIncrementAtom)
          expectTypeOf(result).toEqualTypeOf<typeof returnOfJotai>()
          return <></>
        }}
      </Atom>
    )
    ;() => (
      <Atom atom={loadableAtom}>
        {(result) => {
          const returnOfJotai = useAtom(loadableAtom)
          expectTypeOf(result).toEqualTypeOf<typeof returnOfJotai>()
          return <></>
        }}
      </Atom>
    )

    expectTypeOf(<Atom atom={countAtom}>{() => <></>}</Atom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<Atom atom={countAtom}>{() => <></>}</Atom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<Atom atom={readOnlyCountAtom}>{() => <></>}</Atom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<Atom atom={readOnlyCountAtom}>{() => <></>}</Atom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<Atom atom={writeOnlyCountAtom}>{() => <></>}</Atom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<Atom atom={writeOnlyCountAtom}>{() => <></>}</Atom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<Atom atom={asyncAtom}>{() => <></>}</Atom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<Atom atom={asyncAtom}>{() => <></>}</Atom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<Atom atom={asyncIncrementAtom}>{() => <></>}</Atom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<Atom atom={asyncIncrementAtom}>{() => <></>}</Atom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<Atom atom={loadableAtom}>{() => <></>}</Atom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<Atom atom={loadableAtom}>{() => <></>}</Atom>).not.toEqualTypeOf<ReactNode>()
  })
})
