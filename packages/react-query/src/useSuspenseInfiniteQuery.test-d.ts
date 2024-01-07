/* eslint-disable react-hooks/rules-of-hooks */
import type { InfiniteData } from '@tanstack/react-query'
import { expectTypeOf } from 'vitest'
import { useSuspenseInfiniteQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = () => 'response' as const
const boolean = Math.random() > 0.5

type AwaitedQueryFnReturn = Awaited<ReturnType<typeof queryFn>>

// arg1:queryKey, arg2: queryFn, arg3: options
expectTypeOf(
  useSuspenseInfiniteQuery(queryKey, queryFn, {
    enabled: true,
  }).data
).toEqualTypeOf<InfiniteData<AwaitedQueryFnReturn>>()
expectTypeOf(
  useSuspenseInfiniteQuery(queryKey, queryFn, {
    enabled: boolean,
  }).data
).toEqualTypeOf<InfiniteData<AwaitedQueryFnReturn> | undefined>()
expectTypeOf(
  useSuspenseInfiniteQuery(queryKey, queryFn, {
    enabled: false,
  }).data
).toEqualTypeOf<undefined>()

// arg1:queryKey, arg2: options
expectTypeOf(
  useSuspenseInfiniteQuery(queryKey, {
    queryFn,
    enabled: true,
  }).data
).toEqualTypeOf<InfiniteData<AwaitedQueryFnReturn>>()
expectTypeOf(
  useSuspenseInfiniteQuery(queryKey, {
    queryFn,
    enabled: boolean,
  }).data
).toEqualTypeOf<InfiniteData<AwaitedQueryFnReturn> | undefined>()
expectTypeOf(
  useSuspenseInfiniteQuery(queryKey, {
    queryFn,
    enabled: false,
  }).data
).toEqualTypeOf<undefined>()

// arg1: options
expectTypeOf(
  useSuspenseInfiniteQuery({
    queryKey,
    queryFn,
    enabled: true,
  }).data
).toEqualTypeOf<InfiniteData<AwaitedQueryFnReturn>>()
expectTypeOf(
  useSuspenseInfiniteQuery({
    queryKey,
    queryFn,
    enabled: boolean,
  }).data
).toEqualTypeOf<InfiniteData<AwaitedQueryFnReturn> | undefined>()
expectTypeOf(
  useSuspenseInfiniteQuery({
    queryKey,
    queryFn,
    enabled: false,
  }).data
).toEqualTypeOf<undefined>()

// @ts-expect-error no arg
useSuspenseInfiniteQuery()
