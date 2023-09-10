/* eslint-disable react-hooks/rules-of-hooks */
import { InfiniteData } from '@tanstack/react-query'
import { expectError, expectType } from 'tsd'
import { useSuspenseInfiniteQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = async () => 'response' as const
const boolean = Math.random() > 0.5

type AwaitedQueryFnReturn = Awaited<ReturnType<typeof queryFn>>

// arg1:queryKey, arg2: queryFn, arg3: options
expectType<InfiniteData<AwaitedQueryFnReturn>>(
  useSuspenseInfiniteQuery(queryKey, queryFn, {
    enabled: true,
  }).data
)
expectType<InfiniteData<AwaitedQueryFnReturn> | undefined>(
  useSuspenseInfiniteQuery(queryKey, queryFn, {
    enabled: boolean,
  }).data
)
expectType<undefined>(
  useSuspenseInfiniteQuery(queryKey, queryFn, {
    enabled: false,
  }).data
)

// arg1:queryKey, arg2: options
expectType<InfiniteData<AwaitedQueryFnReturn>>(
  useSuspenseInfiniteQuery(queryKey, {
    queryFn,
    enabled: true,
  }).data
)
expectType<InfiniteData<AwaitedQueryFnReturn> | undefined>(
  useSuspenseInfiniteQuery(queryKey, {
    queryFn,
    enabled: boolean,
  }).data
)
expectType<undefined>(
  useSuspenseInfiniteQuery(queryKey, {
    queryFn,
    enabled: false,
  }).data
)

// arg1: options
expectType<InfiniteData<AwaitedQueryFnReturn>>(
  useSuspenseInfiniteQuery({
    queryKey,
    queryFn,
    enabled: true,
  }).data
)
expectType<InfiniteData<AwaitedQueryFnReturn> | undefined>(
  useSuspenseInfiniteQuery({
    queryKey,
    queryFn,
    enabled: boolean,
  }).data
)
expectType<undefined>(
  useSuspenseInfiniteQuery({
    queryKey,
    queryFn,
    enabled: false,
  }).data
)

// no arg
expectError(useSuspenseInfiniteQuery())
