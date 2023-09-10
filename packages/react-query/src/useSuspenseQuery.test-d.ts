/* eslint-disable react-hooks/rules-of-hooks */
import { expectError, expectType } from 'tsd'
import { useSuspenseQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = async () => 'response' as const
const boolean = Math.random() > 0.5

type AwaitedQueryFnReturn = Awaited<ReturnType<typeof queryFn>>

// arg1:queryKey, arg2: queryFn, arg3: options
expectType<AwaitedQueryFnReturn>(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: true,
  }).data
)
expectType<AwaitedQueryFnReturn | undefined>(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: boolean,
  }).data
)
expectType<undefined>(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: false,
  }).data
)

// arg1:queryKey, arg2: options
expectType<AwaitedQueryFnReturn>(
  useSuspenseQuery(queryKey, {
    queryFn,
    enabled: true,
  }).data
)
expectType<AwaitedQueryFnReturn | undefined>(
  useSuspenseQuery(queryKey, {
    queryFn,
    enabled: boolean,
  }).data
)
expectType<undefined>(
  useSuspenseQuery(queryKey, {
    queryFn,
    enabled: false,
  }).data
)

// arg1: options
expectType<AwaitedQueryFnReturn>(
  useSuspenseQuery({
    queryKey,
    queryFn,
    enabled: true,
  }).data
)
expectType<AwaitedQueryFnReturn | undefined>(
  useSuspenseQuery({
    queryKey,
    queryFn,
    enabled: boolean,
  }).data
)
expectType<undefined>(
  useSuspenseQuery({
    queryKey,
    queryFn,
    enabled: false,
  }).data
)

// no arg
expectError(useSuspenseQuery())
