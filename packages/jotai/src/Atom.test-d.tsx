import { atom, useAtom } from 'jotai'
import type { ReactNode } from 'react'
import { Atom } from './Atom'

const countAtom = atom(0)
const asyncAtom = atom(async () => Promise.resolve('string'))
// eslint-disable-next-line @typescript-eslint/require-await
const asyncIncrementAtom = atom(null, async (get, set) => {
  set(countAtom, get(countAtom) + 1)
})

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

    expectTypeOf(<Atom atom={countAtom}>{() => <></>}</Atom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<Atom atom={countAtom}>{() => <></>}</Atom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<Atom atom={asyncAtom}>{() => <></>}</Atom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<Atom atom={asyncAtom}>{() => <></>}</Atom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<Atom atom={asyncIncrementAtom}>{() => <></>}</Atom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<Atom atom={asyncIncrementAtom}>{() => <></>}</Atom>).not.toEqualTypeOf<ReactNode>()
  })
})
