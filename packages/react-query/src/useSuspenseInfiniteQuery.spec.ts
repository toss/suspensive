/* eslint-disable react-hooks/rules-of-hooks */
import type { InfiniteData } from '@tanstack/react-query'
import { expectTypeOf } from 'vitest'
import { useSuspenseInfiniteQuery } from './useSuspenseInfiniteQuery'

const queryKey = ['key'] as const
const queryFn = async () => 'response' as const

// data is always defined
expectTypeOf(useSuspenseInfiniteQuery(queryKey, queryFn).data).toEqualTypeOf<
  InfiniteData<Awaited<ReturnType<typeof queryFn>>>
>()
expectTypeOf(useSuspenseInfiniteQuery(queryKey, queryFn, {}).data).toEqualTypeOf<
  InfiniteData<Awaited<ReturnType<typeof queryFn>>>
>()
expectTypeOf(useSuspenseInfiniteQuery(queryKey, { queryFn }).data).toEqualTypeOf<
  InfiniteData<Awaited<ReturnType<typeof queryFn>>>
>()
expectTypeOf(useSuspenseInfiniteQuery({ queryKey, queryFn }).data).toEqualTypeOf<
  InfiniteData<Awaited<ReturnType<typeof queryFn>>>
>()

// status is always 'success'
expectTypeOf(useSuspenseInfiniteQuery(queryKey, queryFn).status).toEqualTypeOf<'success'>()
expectTypeOf(useSuspenseInfiniteQuery(queryKey, queryFn, {}).status).toEqualTypeOf<'success'>()
expectTypeOf(useSuspenseInfiniteQuery(queryKey, { queryFn }).status).toEqualTypeOf<'success'>()
expectTypeOf(useSuspenseInfiniteQuery({ queryKey, queryFn }).status).toEqualTypeOf<'success'>()
