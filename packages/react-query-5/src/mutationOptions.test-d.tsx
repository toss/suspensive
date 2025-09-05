import {
  type UseMutateAsyncFunction,
  type UseMutateFunction,
  type UseMutationResult,
  useMutation,
} from '@tanstack/react-query'
import { describe, expectTypeOf, it } from 'vitest'
import { Mutation } from './Mutation'
import { mutationOptions } from './mutationOptions'

const mutationOption =
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  mutationOptions({
    mutationFn: () => Promise.resolve(1),
    onMutate: () => 'onMutation',
  })

describe('mutationOptions', () => {
  it('should be used with useMutation', () => {
    const mutation = useMutation(mutationOption)
    expectTypeOf(mutation).toEqualTypeOf<UseMutationResult<number, Error, void, string>>()
    expectTypeOf(mutation.data).toEqualTypeOf<number | undefined>()
    expectTypeOf(mutation.mutate).toEqualTypeOf<UseMutateFunction<number, Error, void, string>>()
    expectTypeOf(mutation.mutateAsync).toEqualTypeOf<UseMutateAsyncFunction<number, Error, void, string>>()
  })
  it('should be used with <Mutation/>', () => {
    ;(() => (
      <Mutation {...mutationOption}>
        {(mutation) => {
          expectTypeOf(mutation).toEqualTypeOf<UseMutationResult<number, Error, void, string>>()
          expectTypeOf(mutation.data).toEqualTypeOf<number | undefined>()
          return <></>
        }}
      </Mutation>
    ))()
  })
})
