/* eslint-disable react-hooks/rules-of-hooks */
import { sleep } from '@suspensive/test-utils'
import { describe, expectTypeOf, it } from 'vitest'
import { useSuspenseQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = () => sleep(10).then(() => ({ text: 'response' }) as const)
const boolean = Math.random() > 0.5
const select = (data: Awaited<ReturnType<typeof queryFn>>) => data.text

//@ts-expect-error no arg
useSuspenseQuery()

//@ts-expect-error no suspense
useSuspenseQuery({ queryKey, queryFn, suspense: boolean })
//@ts-expect-error no suspense
useSuspenseQuery(queryKey, { queryFn, suspense: boolean })
//@ts-expect-error no suspense
useSuspenseQuery(queryKey, queryFn, { suspense: boolean })

//@ts-expect-error no useErrorBoundary
useSuspenseQuery({ queryKey, queryFn, useErrorBoundary: boolean })
//@ts-expect-error no useErrorBoundary
useSuspenseQuery(queryKey, { queryFn, useErrorBoundary: boolean })
//@ts-expect-error no useErrorBoundary
useSuspenseQuery(queryKey, queryFn, { useErrorBoundary: boolean })

//@ts-expect-error no enabled
useSuspenseQuery({ queryKey, queryFn, enabled: boolean })
//@ts-expect-error no enabled
useSuspenseQuery(queryKey, { queryFn, enabled: boolean })
//@ts-expect-error no enabled
useSuspenseQuery(queryKey, queryFn, { enabled: boolean })

//@ts-expect-error no placeholderData
useSuspenseQuery({ queryKey, queryFn, placeholderData: 'placeholder' })
//@ts-expect-error no placeholderData
useSuspenseQuery(queryKey, { queryFn, placeholderData: 'placeholder' })
//@ts-expect-error no placeholderData
useSuspenseQuery(queryKey, queryFn, { placeholderData: 'placeholder' })

//@ts-expect-error no isPlaceholderData
useSuspenseQuery(queryKey, queryFn).isPlaceholderData
//@ts-expect-error no isPlaceholderData
useSuspenseQuery(queryKey, queryFn, {}).isPlaceholderData
//@ts-expect-error no isPlaceholderData
useSuspenseQuery(queryKey, { queryFn }).isPlaceholderData
//@ts-expect-error no isPlaceholderData
useSuspenseQuery({ queryKey, queryFn }).isPlaceholderData

describe('useSuspenseQuery', () => {
  it("'s data is always defined", () => {
    expectTypeOf(useSuspenseQuery(queryKey, queryFn).data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
    expectTypeOf(useSuspenseQuery(queryKey, queryFn, {}).data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
    expectTypeOf(useSuspenseQuery(queryKey, { queryFn }).data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
    expectTypeOf(useSuspenseQuery({ queryKey, queryFn }).data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()

    // with select
    expectTypeOf(useSuspenseQuery(queryKey, queryFn, { select }).data).toEqualTypeOf<ReturnType<typeof select>>()
    expectTypeOf(useSuspenseQuery(queryKey, { queryFn, select }).data).toEqualTypeOf<ReturnType<typeof select>>()
    expectTypeOf(useSuspenseQuery({ queryKey, queryFn, select }).data).toEqualTypeOf<ReturnType<typeof select>>()
  })

  it("'s status is always 'success'", () => {
    expectTypeOf(useSuspenseQuery(queryKey, queryFn).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery(queryKey, queryFn, {}).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery(queryKey, { queryFn }).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery({ queryKey, queryFn }).status).toEqualTypeOf<'success'>()

    // with select
    expectTypeOf(useSuspenseQuery(queryKey, queryFn, { select }).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery(queryKey, { queryFn, select }).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery({ queryKey, queryFn, select }).status).toEqualTypeOf<'success'>()
  })
})
