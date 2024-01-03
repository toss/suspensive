/* eslint-disable react-hooks/rules-of-hooks */
import { describe, expectTypeOf, it } from 'vitest'
import { useSuspenseQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = () => 'response' as const
const boolean = Math.random() > 0.5

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
useSuspenseQuery({ queryKey, queryFn, placeholderData: boolean })
//@ts-expect-error no placeholderData
useSuspenseQuery(queryKey, { queryFn, placeholderData: boolean })
//@ts-expect-error no placeholderData
useSuspenseQuery(queryKey, queryFn, { placeholderData: boolean })

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
  })

  it("'s status is always 'success'", () => {
    expectTypeOf(useSuspenseQuery(queryKey, queryFn).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery(queryKey, queryFn, {}).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery(queryKey, { queryFn }).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseQuery({ queryKey, queryFn }).status).toEqualTypeOf<'success'>()
  })
})
