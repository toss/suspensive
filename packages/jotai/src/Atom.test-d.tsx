import { atom } from 'jotai'
import type { ReactNode } from 'react'
import { Atom } from './Atom'

describe('<Atom/>', () => {
  const asyncAtom = atom(async () => Promise.resolve('string'))

  it('type check', () => {
    ;() => (
      <Atom atom={asyncAtom}>
        {([value]) => {
          expectTypeOf(value).toEqualTypeOf<string>()
          return <></>
        }}
      </Atom>
    )

    expectTypeOf(<Atom atom={asyncAtom}>{() => <></>}</Atom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<Atom atom={asyncAtom}>{() => <></>}</Atom>).not.toEqualTypeOf<ReactNode>()
  })
})
