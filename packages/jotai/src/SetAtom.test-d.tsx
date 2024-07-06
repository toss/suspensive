import { type SetStateAction, atom } from 'jotai'
import type { ReactNode } from 'react'
import { SetAtom, type SetAtomResult } from './SetAtom'

describe('<SetAtom/>', () => {
  const countAtom = atom(0)

  it('type check', () => {
    ;() => (
      <SetAtom atom={countAtom}>
        {(setCount) => {
          expectTypeOf(setCount).toEqualTypeOf<SetAtomResult<[SetStateAction<number>], void>>()
          return <></>
        }}
      </SetAtom>
    )

    expectTypeOf(<SetAtom atom={countAtom}>{() => <></>}</SetAtom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<SetAtom atom={countAtom}>{() => <></>}</SetAtom>).not.toEqualTypeOf<ReactNode>()
  })
})
