/* eslint-disable react-hooks/rules-of-hooks */
import { queryFn, queryKey } from '@suspensive/test-utils'
import { describe, expectTypeOf, it } from 'vitest'
import { useSuspenseQuery } from '../dist'

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
    expectTypeOf(useSuspenseQuery(queryKey, queryFn, { select: (data) => data.text }).data).toEqualTypeOf<string>()
    expectTypeOf(useSuspenseQuery(queryKey, { queryFn, select: (data) => data.text }).data).toEqualTypeOf<string>()
    expectTypeOf(useSuspenseQuery({ queryKey, queryFn, select: (data) => data.text }).data).toEqualTypeOf<string>()
  })

  it("'s status is always 'success'", () => {
    expectTypeOf(useSuspenseQuery(queryKey, queryFn).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery(queryKey, queryFn, {}).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery(queryKey, { queryFn }).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery({ queryKey, queryFn }).status).toEqualTypeOf<'success'>()

    // with select
    expectTypeOf(useSuspenseQuery(queryKey, queryFn, { select: (data) => data.text }).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery(queryKey, { queryFn, select: (data) => data.text }).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery({ queryKey, queryFn, select: (data) => data.text }).status).toEqualTypeOf<'success'>()
  })
})
