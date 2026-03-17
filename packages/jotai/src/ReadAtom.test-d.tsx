import { atom, useReadAtom } from 'jotai'
import { loadable } from 'jotai/utils'
import type { ReactNode } from 'react'
import { ReadAtom } from './ReadAtom'

const countAtom = atom(0)
const readOnlyCountAtom = atom((get) => get(countAtom))
const writeOnlyCountAtom = atom(null, (get, set) => set(countAtom, get(countAtom) + 1))
const asyncAtom = atom(async () => Promise.resolve('string'))
// eslint-disable-next-line @typescript-eslint/require-await
const asyncIncrementAtom = atom(null, async (get, set) => {
  set(countAtom, get(countAtom) + 1)
})
const loadableAtom = loadable(asyncAtom)

describe('<ReadAtom/>', () => {
  it('type check', () => {
    ;(() => (
      <ReadAtom atom={countAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useReadAtom(countAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </ReadAtom>
    ))()
    ;(() => (
      <ReadAtom atom={readOnlyCountAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useReadAtom(readOnlyCountAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </ReadAtom>
    ))()
    ;(() => (
      <ReadAtom atom={writeOnlyCountAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useReadAtom(writeOnlyCountAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </ReadAtom>
    ))()
    ;(() => (
      <ReadAtom atom={asyncAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useReadAtom(asyncAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </ReadAtom>
    ))()
    ;(() => (
      <ReadAtom atom={asyncIncrementAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useReadAtom(asyncIncrementAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </ReadAtom>
    ))()
    ;(() => (
      <ReadAtom atom={loadableAtom}>
        {(value) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const valueOfJotai = useReadAtom(loadableAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </ReadAtom>
    ))()

    expectTypeOf(<ReadAtom atom={countAtom}>{() => <></>}</ReadAtom>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<ReadAtom atom={countAtom}>{() => <></>}</ReadAtom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<ReadAtom atom={readOnlyCountAtom}>{() => <></>}</ReadAtom>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<ReadAtom atom={readOnlyCountAtom}>{() => <></>}</ReadAtom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<ReadAtom atom={writeOnlyCountAtom}>{() => <></>}</ReadAtom>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<ReadAtom atom={writeOnlyCountAtom}>{() => <></>}</ReadAtom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<ReadAtom atom={asyncAtom}>{() => <></>}</ReadAtom>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<ReadAtom atom={asyncAtom}>{() => <></>}</ReadAtom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<ReadAtom atom={asyncIncrementAtom}>{() => <></>}</ReadAtom>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<ReadAtom atom={asyncIncrementAtom}>{() => <></>}</ReadAtom>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<ReadAtom atom={loadableAtom}>{() => <></>}</ReadAtom>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<ReadAtom atom={loadableAtom}>{() => <></>}</ReadAtom>).not.toEqualTypeOf<ReactNode>()
  })
})
