/* eslint-disable react-hooks/rules-of-hooks */
import { expectError } from 'tsd'
import { useSuspenseInfiniteQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = async () => 'response' as const
const boolean = Math.random() > 0.5

// no arg
expectError(useSuspenseInfiniteQuery())
// no suspense
expectError(useSuspenseInfiniteQuery({ queryKey, queryFn, suspense: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, { queryFn, suspense: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, queryFn, { suspense: boolean }))
// no useErrorBoundary
expectError(useSuspenseInfiniteQuery({ queryKey, queryFn, useErrorBoundary: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, { queryFn, useErrorBoundary: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, queryFn, { useErrorBoundary: boolean }))
// no enabled
expectError(useSuspenseInfiniteQuery({ queryKey, queryFn, enabled: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, { queryFn, enabled: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, queryFn, { enabled: boolean }))
// no placeholderData
expectError(useSuspenseInfiniteQuery({ queryKey, queryFn, placeholderData: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, { queryFn, placeholderData: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, queryFn, { placeholderData: boolean }))

// Result
// no isPlaceholderData
expectError(useSuspenseInfiniteQuery(queryKey, queryFn).isPlaceholderData)
expectError(useSuspenseInfiniteQuery(queryKey, queryFn, {}).isPlaceholderData)
expectError(useSuspenseInfiniteQuery(queryKey, { queryFn }).isPlaceholderData)
expectError(useSuspenseInfiniteQuery({ queryKey, queryFn }).isPlaceholderData)
