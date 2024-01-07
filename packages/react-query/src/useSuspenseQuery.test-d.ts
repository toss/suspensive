/* eslint-disable react-hooks/rules-of-hooks */
import { expectTypeOf } from 'vitest'
import { useSuspenseQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = () => 'response' as const
const boolean = Math.random() > 0.5

type AwaitedQueryFnReturn = Awaited<ReturnType<typeof queryFn>>

// arg1:queryKey, arg2: queryFn, arg3: options
expectTypeOf(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: true,
  }).data
).toEqualTypeOf<AwaitedQueryFnReturn>()
expectTypeOf(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: boolean,
  }).data
).toEqualTypeOf<AwaitedQueryFnReturn | undefined>()
expectTypeOf(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: false,
  }).data
).toEqualTypeOf<undefined>()

// arg1:queryKey, arg2: options
expectTypeOf(
  useSuspenseQuery(queryKey, {
    queryFn,
    enabled: true,
  }).data
).toEqualTypeOf<AwaitedQueryFnReturn>()
expectTypeOf(
  useSuspenseQuery(queryKey, {
    queryFn,
    enabled: boolean,
  }).data
).toEqualTypeOf<AwaitedQueryFnReturn | undefined>()
expectTypeOf(
  useSuspenseQuery(queryKey, {
    queryFn,
    enabled: false,
  }).data
).toEqualTypeOf<undefined>()

// arg1: options
expectTypeOf(
  useSuspenseQuery({
    queryKey,
    queryFn,
    enabled: true,
  }).data
).toEqualTypeOf<AwaitedQueryFnReturn>()
expectTypeOf(
  useSuspenseQuery({
    queryKey,
    queryFn,
    enabled: boolean,
  }).data
).toEqualTypeOf<AwaitedQueryFnReturn | undefined>()
expectTypeOf(
  useSuspenseQuery({
    queryKey,
    queryFn,
    enabled: false,
  }).data
).toEqualTypeOf<undefined>()

// @ts-expect-error no arg
useSuspenseQuery()
