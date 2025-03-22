import { type UseMutateFunction, type UseMutationResult, useMutation } from '@tanstack/react-query'
import { describe, expectTypeOf, it } from 'vitest'
import { Mutation } from './Mutation'
import { mutationOptions } from './mutationOptions'

const mutationOption = mutationOptions({
  mutationFn: () => Promise.resolve(5),
})

describe('mutationOptions', () => {
  it('should be used with useMutation', () => {
    const mutation = useMutation(mutationOption)
    expectTypeOf(mutation).toEqualTypeOf<UseMutationResult<number, Error, void>>()
    expectTypeOf(mutation.data).toEqualTypeOf<number | undefined>()
    expectTypeOf(mutation.mutate).toEqualTypeOf<UseMutateFunction<number>>()
  })
  it('should be used with <Mutation/>', () => {
    ;(() => (
      <Mutation {...mutationOption}>
        {(mutation) => {
          expectTypeOf(mutation).toEqualTypeOf<UseMutationResult<number, Error, void>>()
          expectTypeOf(mutation.data).toEqualTypeOf<number | undefined>()
          return <></>
        }}
      </Mutation>
    ))()
  })
})
