import { atom, useSetAtom } from 'jotai'
import type { ReactNode } from 'react'
import { SetAtom } from './SetAtom'

const countAtom = atom(0)
const writeOnlyCountAtom = atom(null, (get, set) => set(countAtom, get(countAtom) + 1))
// eslint-disable-next-line @typescript-eslint/require-await
const asyncIncrementAtom = atom(null, async (get, set) => {
  set(countAtom, get(countAtom) + 1)
})

describe('<SetAtom/>', () => {
  it('type check', () => {
    ;(() => (
      <SetAtom atom={countAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useSetAtom(countAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </SetAtom>
    ))()
    ;(() => (
      <SetAtom atom={writeOnlyCountAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useSetAtom(writeOnlyCountAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </SetAtom>
    ))()
    ;(() => (
      <SetAtom atom={asyncIncrementAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useSetAtom(asyncIncrementAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </SetAtom>
    ))()

    expectTypeOf(<SetAtom atom={countAtom}>{() => <></>}</SetAtom>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<SetAtom atom={countAtom}>{() => <></>}</SetAtom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<SetAtom atom={writeOnlyCountAtom}>{() => <></>}</SetAtom>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<SetAtom atom={writeOnlyCountAtom}>{() => <></>}</SetAtom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<SetAtom atom={asyncIncrementAtom}>{() => <></>}</SetAtom>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<SetAtom atom={asyncIncrementAtom}>{() => <></>}</SetAtom>).not.toEqualTypeOf<ReactNode>()
  })
})
