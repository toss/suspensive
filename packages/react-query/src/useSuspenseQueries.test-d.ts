/* eslint-disable react-hooks/rules-of-hooks */
import { expectError } from 'tsd'
import { describe, expectTypeOf, it } from 'vitest'
import { useSuspenseQueries } from '../dist'

const select = () => 'selected' as const

const queryOptions = <TIndex extends number>(index: TIndex) => ({
  queryKey: ['key', index] as const,
  queryFn: () => ({ name: `resolved${index}` }) as const,
})

expectError(
  useSuspenseQueries({
    queries: [
      { ...queryOptions(0), suspense: false },
      { ...queryOptions(1), select, suspense: true },
    ] as const,
  })
)

// noItem
expectError(useSuspenseQueries({}))
expectError(useSuspenseQueries())

describe('useSuspenseQueries', () => {
  it("'s type check", () => {
    const suspenseQueries = useSuspenseQueries({
      queries: [
        { ...queryOptions(0) },
        { ...queryOptions(1) },
        { ...queryOptions(2), select: () => ({ name: 'selected' }) as const },
      ] as const,
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
    expectTypeOf(suspenseQueries[2].data).toEqualTypeOf<{ readonly name: 'selected' }>()
  })
})
