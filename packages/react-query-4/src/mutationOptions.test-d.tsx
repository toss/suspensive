import {
  type UseMutateAsyncFunction,
  type UseMutateFunction,
  type UseMutationResult,
  useMutation,
} from '@tanstack/react-query'
import { describe, expectTypeOf, it } from 'vitest'
import { Mutation } from './Mutation'
import { mutationOptions } from './mutationOptions'

const mutationOption = mutationOptions({
  mutationFn: () => Promise.resolve(1),
  onMutate: () => 'onMutation',
})

describe('mutationOptions', () => {
  it('should be used with useMutation', () => {
    const mutation = useMutation(mutationOption)
    expectTypeOf(mutation).toEqualTypeOf<UseMutationResult<number, unknown, void, string>>()
    expectTypeOf(mutation.data).toEqualTypeOf<number | undefined>()
    expectTypeOf(mutation.mutate).toEqualTypeOf<UseMutateFunction<number, unknown, void, string>>()
    expectTypeOf(mutation.mutateAsync).toEqualTypeOf<UseMutateAsyncFunction<number, unknown, void, string>>()
  })
  it('should be used with <Mutation/>', () => {
    ;(() => (
      <Mutation {...mutationOption}>
        {(mutation) => {
          expectTypeOf(mutation).toEqualTypeOf<UseMutationResult<number, unknown, void, string>>()
          expectTypeOf(mutation.data).toEqualTypeOf<number | undefined>()
          return <></>
        }}
      </Mutation>
    ))()
  })
})
