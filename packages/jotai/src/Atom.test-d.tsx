import { atom } from 'jotai'
import type { ReactNode } from 'react'
import { Atom } from './Atom'
import { atomOptions } from './atomOptions'

describe('<Atom/>', () => {
  const asyncAtom = atom(async () => Promise.resolve('string'))
  const atomOption = atomOptions({ atom: asyncAtom, options: { delay: 1000 } })

  it('type check', () => {
    ;() => (
      <Atom atom={asyncAtom}>
        {([value]) => {
          expectTypeOf(value).toEqualTypeOf<string>()
          return <></>
        }}
      </Atom>
    )
    ;() => (
      <Atom {...atomOption}>
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
