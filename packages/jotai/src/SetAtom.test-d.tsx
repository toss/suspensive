import { type SetStateAction, atom } from 'jotai'
import type { ReactNode } from 'react'
import { SetAtom } from './SetAtom'
import type { SetAtom as TSetAtom } from './utility-types/ChildrenRenderProps'

const countAtom = atom(0)

describe('<SetAtom/>', () => {
  it('type check', () => {
    ;() => (
      <SetAtom atom={countAtom}>
        {(setCount) => {
          expectTypeOf(setCount).toEqualTypeOf<TSetAtom<[SetStateAction<number>], void>>()
          return <></>
        }}
      </SetAtom>
    )

    expectTypeOf(<SetAtom atom={countAtom}>{() => <></>}</SetAtom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<SetAtom atom={countAtom}>{() => <></>}</SetAtom>).not.toEqualTypeOf<ReactNode>()
  })
})
