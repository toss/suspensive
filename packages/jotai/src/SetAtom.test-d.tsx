import { atom, useSetAtom } from 'jotai'
import type { ReactNode } from 'react'
import { SetAtom } from './SetAtom'

const countAtom = atom(0)
const writeOnlyCountAtom = atom(null, (get, set) => set(countAtom, get(countAtom) + 1))
const asyncIncrementAtom = atom(null, async (get, set) => {
  set(countAtom, get(countAtom) + 1)
})

describe('<SetAtom/>', () => {
  it('type check', () => {
    ;() => (
      <SetAtom atom={countAtom}>
        {(value) => {
          const valueOfJotai = useSetAtom(countAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </SetAtom>
    )
    ;() => (
      <SetAtom atom={writeOnlyCountAtom}>
        {(value) => {
          const valueOfJotai = useSetAtom(writeOnlyCountAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </SetAtom>
    )
    ;() => (
      <SetAtom atom={asyncIncrementAtom}>
        {(value) => {
          const valueOfJotai = useSetAtom(asyncIncrementAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </SetAtom>
    )

    expectTypeOf(<SetAtom atom={countAtom}>{() => <></>}</SetAtom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<SetAtom atom={countAtom}>{() => <></>}</SetAtom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<SetAtom atom={writeOnlyCountAtom}>{() => <></>}</SetAtom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<SetAtom atom={writeOnlyCountAtom}>{() => <></>}</SetAtom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<SetAtom atom={asyncIncrementAtom}>{() => <></>}</SetAtom>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<SetAtom atom={asyncIncrementAtom}>{() => <></>}</SetAtom>).not.toEqualTypeOf<ReactNode>()
  })
})
