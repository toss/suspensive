/* eslint-disable react-hooks/rules-of-hooks */
import { sleep } from '@suspensive/test-utils'
import type { InfiniteData } from '@tanstack/react-query'
import { expectTypeOf } from 'vitest'
import { useSuspenseInfiniteQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = () => sleep(10).then(() => ({ text: 'response' }) as const)
const boolean = Math.random() > 0.5

// arg1:queryKey, arg2: queryFn, arg3: options
expectTypeOf(
  useSuspenseInfiniteQuery(queryKey, queryFn, {
    enabled: true,
  }).data
).toEqualTypeOf<InfiniteData<Awaited<ReturnType<typeof queryFn>>>>()
expectTypeOf(
  useSuspenseInfiniteQuery(queryKey, queryFn, {
    enabled: boolean,
  }).data
).toEqualTypeOf<InfiniteData<Awaited<ReturnType<typeof queryFn>>> | undefined>()
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
).toEqualTypeOf<InfiniteData<Awaited<ReturnType<typeof queryFn>>>>()
expectTypeOf(
  useSuspenseInfiniteQuery(queryKey, {
    queryFn,
    enabled: boolean,
  }).data
).toEqualTypeOf<InfiniteData<Awaited<ReturnType<typeof queryFn>>> | undefined>()
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
).toEqualTypeOf<InfiniteData<Awaited<ReturnType<typeof queryFn>>>>()
expectTypeOf(
  useSuspenseInfiniteQuery({
    queryKey,
    queryFn,
    enabled: boolean,
  }).data
).toEqualTypeOf<InfiniteData<Awaited<ReturnType<typeof queryFn>>> | undefined>()
expectTypeOf(
  useSuspenseInfiniteQuery({
    queryKey,
    queryFn,
    enabled: false,
  }).data
).toEqualTypeOf<undefined>()

// @ts-expect-error no arg
useSuspenseInfiniteQuery()
