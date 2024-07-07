import { atom, useAtomValue } from 'jotai'
import type { ReactNode } from 'react'
import { AtomValue } from './AtomValue'

const asyncAtom = atom(() => Promise.resolve('string'))

describe('<AtomValue/>', () => {
  it('type check', () => {
    ;() => (
      <AtomValue atom={asyncAtom}>
        {(value) => {
          const valueOfJotai = useAtomValue(asyncAtom)
          expectTypeOf(value).toEqualTypeOf<typeof valueOfJotai>()
          return <></>
        }}
      </AtomValue>
    )

    expectTypeOf(<AtomValue atom={asyncAtom}>{() => <></>}</AtomValue>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<AtomValue atom={asyncAtom}>{() => <></>}</AtomValue>).not.toEqualTypeOf<ReactNode>()
  })
})
