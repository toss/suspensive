/* eslint-disable react-hooks/rules-of-hooks */
import { sleep } from '@suspensive/test-utils'
import { expectTypeOf } from 'vitest'
import { useSuspenseQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = () => sleep(10).then(() => ({ text: 'response' }) as const)
const boolean = Math.random() > 0.5
const select = (data: Awaited<ReturnType<typeof queryFn>>) => data.text

// arg1:queryKey, arg2: queryFn, arg3: options
expectTypeOf(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: true,
  }).data
).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
expectTypeOf(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: boolean,
  }).data
).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>> | undefined>()
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
).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
expectTypeOf(
  useSuspenseQuery(queryKey, {
    queryFn,
    enabled: boolean,
  }).data
).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>> | undefined>()
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
).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
expectTypeOf(
  useSuspenseQuery({
    queryKey,
    queryFn,
    enabled: boolean,
  }).data
).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>> | undefined>()
expectTypeOf(
  useSuspenseQuery({
    queryKey,
    queryFn,
    enabled: false,
  }).data
).toEqualTypeOf<undefined>()

// select
// arg1:queryKey, arg2: queryFn, arg3: options
expectTypeOf(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: true,
    select,
  }).data
).toEqualTypeOf<ReturnType<typeof select>>()
expectTypeOf(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: boolean,
    select,
  }).data
).toEqualTypeOf<ReturnType<typeof select> | undefined>()
expectTypeOf(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: false,
    select,
  }).data
).toEqualTypeOf<undefined>()
// arg1:queryKey, arg2: options
expectTypeOf(
  useSuspenseQuery(queryKey, {
    queryFn,
    enabled: true,
    select,
  }).data
).toEqualTypeOf<ReturnType<typeof select>>()
expectTypeOf(
  useSuspenseQuery(queryKey, {
    queryFn,
    enabled: boolean,
    select,
  }).data
).toEqualTypeOf<ReturnType<typeof select> | undefined>()
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
    select,
  }).data
).toEqualTypeOf<ReturnType<typeof select>>()
expectTypeOf(
  useSuspenseQuery({
    queryKey,
    queryFn,
    enabled: boolean,
    select,
  }).data
).toEqualTypeOf<ReturnType<typeof select> | undefined>()
expectTypeOf(
  useSuspenseQuery({
    queryKey,
    queryFn,
    enabled: false,
    select,
  }).data
).toEqualTypeOf<undefined>()

// @ts-expect-error no arg
useSuspenseQuery()
