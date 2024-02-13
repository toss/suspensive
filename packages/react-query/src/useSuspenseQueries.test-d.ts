/* eslint-disable react-hooks/rules-of-hooks */
import { describe, expectTypeOf, it } from 'vitest'
import { useSuspenseQueries } from '../dist'

const queryFn = () => ({ text: 'response' }) as const
const select = (data: Awaited<ReturnType<typeof queryFn>>) => data.text

const queryOptions = <TIndex extends number>(index: TIndex) => ({
  queryKey: ['key', index] as const,
  queryFn,
})

useSuspenseQueries({
  queries: [
    // @ts-expect-error no suspense
    { ...queryOptions(0), suspense: false },
    // @ts-expect-error no suspense
    { ...queryOptions(1), select, suspense: true },
  ] as const,
})

// @ts-expect-error if no items
useSuspenseQueries({})
// @ts-expect-error if no items
useSuspenseQueries()

describe('useSuspenseQueries', () => {
  it("'s type check", () => {
    const suspenseQueries = useSuspenseQueries({
      queries: [{ ...queryOptions(0) }, { ...queryOptions(1) }, { ...queryOptions(2), select }] as const,
    })

    expectTypeOf(suspenseQueries[0].status).toEqualTypeOf<`success`>()
    expectTypeOf(suspenseQueries[0].data).toEqualTypeOf<
      Awaited<ReturnType<ReturnType<typeof queryOptions<0>>['queryFn']>>
    >()

    expectTypeOf(suspenseQueries[1].status).toEqualTypeOf<`success`>()
    expectTypeOf(suspenseQueries[1].data).toEqualTypeOf<
      Awaited<ReturnType<ReturnType<typeof queryOptions<1>>['queryFn']>>
    >()

    expectTypeOf(suspenseQueries[2].status).toEqualTypeOf<`success`>()
    expectTypeOf(suspenseQueries[2].data).toEqualTypeOf<ReturnType<typeof select>>()
  })
})
