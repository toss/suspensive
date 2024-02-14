/* eslint-disable react-hooks/rules-of-hooks */
import { sleep } from '@suspensive/test-utils'
import { describe, expectTypeOf, it } from 'vitest'
import { useSuspenseQueries } from '../dist'

const queryFn = () => sleep(10).then(() => ({ text: 'response' }) as const)
const select = (data: Awaited<ReturnType<typeof queryFn>>) => data.text

const queryOptions = <TIndex extends number>(index: TIndex) => ({
  queryKey: ['key', index] as const,
  queryFn,
})

useSuspenseQueries({
  queries: [
    // @ts-expect-error no suspense
    { ...queryOptions(3), suspense: false },
    // @ts-expect-error no suspense with select
    { ...queryOptions(4), select, suspense: true },
    // @ts-expect-error no enabled
    { ...queryOptions(5), enabled: true },
    // @ts-expect-error no enabled with select
    { ...queryOptions(6), select, enabled: true },
  ] as const,
})
// @ts-expect-error if no items
useSuspenseQueries({})
// @ts-expect-error if no items
useSuspenseQueries()

describe('useSuspenseQueries', () => {
  it("'s type check", () => {
    const [queryWithoutSelect, queryWithSelect] = useSuspenseQueries({
      queries: [queryOptions(0), { ...queryOptions(1), select }] as const,
    })

    expectTypeOf(queryWithoutSelect.status).toEqualTypeOf<`success`>()
    expectTypeOf(queryWithoutSelect.data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()

    expectTypeOf(queryWithSelect.status).toEqualTypeOf<`success`>()
    expectTypeOf(queryWithSelect.data).toEqualTypeOf<ReturnType<typeof select>>()
  })
})
