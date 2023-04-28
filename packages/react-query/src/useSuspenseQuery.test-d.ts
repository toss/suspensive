import { expectType } from 'tsd'
import { useSuspenseQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = async () => 'response' as const

type AwaitedQueryFnReturn = Awaited<ReturnType<typeof queryFn>>

// arg1:queryKey, arg2: queryFn, arg3: options
expectType<AwaitedQueryFnReturn>(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: true,
  }).data
)
expectType<AwaitedQueryFnReturn | undefined>(
  useSuspenseQuery(queryKey, queryFn, {
    enabled: Math.random() > 0.5,
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
    enabled: Math.random() > 0.5,
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
    enabled: Math.random() > 0.5,
  }).data
)
expectType<undefined>(
  useSuspenseQuery({
    queryKey,
    queryFn,
    enabled: false,
  }).data
)
