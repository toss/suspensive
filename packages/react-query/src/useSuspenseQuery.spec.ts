/* eslint-disable react-hooks/rules-of-hooks */
import { expectTypeOf } from 'vitest'
import { useSuspenseQuery } from './useSuspenseQuery'

const queryKey = ['key'] as const
const queryFn = async () => 'response' as const

// data is always defined
expectTypeOf(useSuspenseQuery(queryKey, queryFn).data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
expectTypeOf(useSuspenseQuery(queryKey, queryFn, {}).data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
expectTypeOf(useSuspenseQuery(queryKey, { queryFn }).data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
expectTypeOf(useSuspenseQuery({ queryKey, queryFn }).data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()

// status is always 'success'
expectTypeOf(useSuspenseQuery(queryKey, queryFn).status).toEqualTypeOf<'success'>()
expectTypeOf(useSuspenseQuery(queryKey, queryFn, {}).status).toEqualTypeOf<'success'>()
expectTypeOf(useSuspenseQuery(queryKey, { queryFn }).status).toEqualTypeOf<'success'>()
expectTypeOf(useSuspenseQuery({ queryKey, queryFn }).status).toEqualTypeOf<'success'>()
