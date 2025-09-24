import { queryOptions } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { IsFetching } from './IsFetching'
import { queryFn, queryKey } from './test-utils'

describe('<IsFetching/>', () => {
  it('type check', () => {
    ;(() => <IsFetching>{(isFetching) => expectTypeOf(isFetching).toEqualTypeOf<number>()}</IsFetching>)()
    ;(() => (
      <IsFetching {...queryOptions({ queryKey, queryFn })}>
        {(isFetching) => expectTypeOf(isFetching).toEqualTypeOf<number>()}
      </IsFetching>
    ))()
    ;(() => (
      <IsFetching queryKey={queryKey}>{(isFetching) => expectTypeOf(isFetching).toEqualTypeOf<number>()}</IsFetching>
    ))()

    expectTypeOf(<IsFetching>{() => <></>}</IsFetching>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<IsFetching>{() => <></>}</IsFetching>).not.toEqualTypeOf<ReactNode>()
  })
})
