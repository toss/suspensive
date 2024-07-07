import { type SetStateAction, atom } from 'jotai'
import type { ReactNode } from 'react'
import { Atom } from './Atom'
import type { SetAtom } from './utility-types/ChildrenRenderProps'

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
        {([count, setCount]) => {
          expectTypeOf(count).toEqualTypeOf<number>()
          expectTypeOf(setCount).toEqualTypeOf<SetAtom<[SetStateAction<number>], void>>()
          return <></>
        }}
      </Atom>
    )
    ;() => (
      <Atom atom={asyncAtom}>
        {([value, setter]) => {
          expectTypeOf(value).toEqualTypeOf<string>()
          expectTypeOf(setter).toEqualTypeOf<never>()
          return <></>
        }}
      </Atom>
    )
    ;() => (
      <Atom atom={asyncIncrementAtom}>
        {([, increment]) => {
          expectTypeOf(increment).toEqualTypeOf<SetAtom<[], Promise<void>>>()
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
