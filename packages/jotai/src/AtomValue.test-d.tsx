import { atom } from 'jotai'
import type { ReactNode } from 'react'
import { AtomValue } from './AtomValue'

const asyncAtom = atom(async () => Promise.resolve('string'))

describe('<AtomValue/>', () => {
  it('type check', () => {
    ;() => (
      <AtomValue atom={asyncAtom}>
        {([value]) => {
          expectTypeOf(value).toEqualTypeOf<string>()
          return <></>
        }}
      </AtomValue>
    )

    expectTypeOf(<AtomValue atom={asyncAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<AtomValue atom={asyncAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
  })
})
