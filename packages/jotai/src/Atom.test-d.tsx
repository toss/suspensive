import { type SetStateAction, atom } from 'jotai'
import type { ReactNode } from 'react'
import { Atom } from './Atom'
import type { SetAtom } from './utility-types/ChildrenRenderProps'

const countAtom = atom(0)
const asyncAtom = atom(async () => Promise.resolve('string'))

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

    expectTypeOf(<Atom atom={asyncAtom}>{() => <></>}</Atom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<Atom atom={asyncAtom}>{() => <></>}</Atom>).not.toEqualTypeOf<ReactNode>()
  })
})
