import type { ReactNode } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { IsMutating } from './IsMutating'
import { queryKey } from './test-utils'

describe('<IsMutating/>', () => {
  it('type check', () => {
    void (() => <IsMutating>{(isMutating) => expectTypeOf(isMutating).toEqualTypeOf<number>()}</IsMutating>)()
    void (() => (
      <IsMutating mutationKey={queryKey}>{(isMutating) => expectTypeOf(isMutating).toEqualTypeOf<number>()}</IsMutating>
    ))()

    expectTypeOf(<IsMutating>{() => <></>}</IsMutating>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<IsMutating>{() => <></>}</IsMutating>).not.toEqualTypeOf<ReactNode>()
  })
})
