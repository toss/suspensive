/* eslint-disable react-hooks/rules-of-hooks */
import { expectError } from 'tsd'
import { describe, expectTypeOf } from 'vitest'
import { useSuspenseQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = async () => 'response' as const
const boolean = Math.random() > 0.5

// Options
// no arg
expectError(useSuspenseQuery())
// no suspense
expectError(useSuspenseQuery({ queryKey, queryFn, suspense: boolean }))
expectError(useSuspenseQuery(queryKey, { queryFn, suspense: boolean }))
expectError(useSuspenseQuery(queryKey, queryFn, { suspense: boolean }))
// no useErrorBoundary
expectError(useSuspenseQuery({ queryKey, queryFn, useErrorBoundary: boolean }))
expectError(useSuspenseQuery(queryKey, { queryFn, useErrorBoundary: boolean }))
expectError(useSuspenseQuery(queryKey, queryFn, { useErrorBoundary: boolean }))
// no enabled
expectError(useSuspenseQuery({ queryKey, queryFn, enabled: boolean }))
expectError(useSuspenseQuery(queryKey, { queryFn, enabled: boolean }))
expectError(useSuspenseQuery(queryKey, queryFn, { enabled: boolean }))
// no placeholderData
expectError(useSuspenseQuery({ queryKey, queryFn, placeholderData: boolean }))
expectError(useSuspenseQuery(queryKey, { queryFn, placeholderData: boolean }))
expectError(useSuspenseQuery(queryKey, queryFn, { placeholderData: boolean }))

// Result
// no isPlaceholderData
expectError(useSuspenseQuery(queryKey, queryFn).isPlaceholderData)
expectError(useSuspenseQuery(queryKey, queryFn, {}).isPlaceholderData)
expectError(useSuspenseQuery(queryKey, { queryFn }).isPlaceholderData)
expectError(useSuspenseQuery({ queryKey, queryFn }).isPlaceholderData)

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
