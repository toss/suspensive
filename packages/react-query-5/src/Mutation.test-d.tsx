import type { UseMutationResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { Mutation } from './Mutation'

const mutationFn = () => Promise.resolve(5)

describe('<Mutation/>', () => {
  it('type check', () => {
    ;(() => (
      <Mutation mutationFn={mutationFn}>
        {(mutation) => {
          expectTypeOf(mutation).toEqualTypeOf<UseMutationResult<number, Error, void>>()
          return <></>
        }}
      </Mutation>
    ))()

    expectTypeOf(<Mutation mutationFn={mutationFn}>{() => <></>}</Mutation>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<Mutation mutationFn={mutationFn}>{() => <></>}</Mutation>).not.toEqualTypeOf<ReactNode>()
  })
})
