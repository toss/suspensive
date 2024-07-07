import { atom, useSetAtom } from 'jotai'
import type { ReactNode } from 'react'
import { SetAtom } from './SetAtom'

const countAtom = atom(0)

describe('<SetAtom/>', () => {
  it('type check', () => {
    ;() => (
      <SetAtom atom={countAtom}>
        {(setCount) => {
          const setCountOfJotai = useSetAtom(countAtom)
          expectTypeOf(setCount).toEqualTypeOf<typeof setCountOfJotai>()
          return <></>
        }}
      </SetAtom>
    )

    expectTypeOf(<SetAtom atom={countAtom}>{() => <></>}</SetAtom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<SetAtom atom={countAtom}>{() => <></>}</SetAtom>).not.toEqualTypeOf<ReactNode>()
  })
})
