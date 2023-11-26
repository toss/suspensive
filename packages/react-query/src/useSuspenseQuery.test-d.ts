/* eslint-disable react-hooks/rules-of-hooks */
import { expectError } from 'tsd'
import { useSuspenseQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = async () => 'response' as const
const boolean = Math.random() > 0.5

// Options
// no arg
expectError(useSuspenseQuery())
// no suspense
expectError(useSuspenseQuery({ queryKey, queryFn, suspense: boolean }))
expectError(useSuspenseQuery(queryKey, { queryFn, suspense: boolean }))
expectError(useSuspenseQuery(queryKey, queryFn, { suspense: boolean }))
// no useErrorBoundary
expectError(useSuspenseQuery({ queryKey, queryFn, useErrorBoundary: boolean }))
expectError(useSuspenseQuery(queryKey, { queryFn, useErrorBoundary: boolean }))
expectError(useSuspenseQuery(queryKey, queryFn, { useErrorBoundary: boolean }))
// no enabled
expectError(useSuspenseQuery({ queryKey, queryFn, enabled: boolean }))
expectError(useSuspenseQuery(queryKey, { queryFn, enabled: boolean }))
expectError(useSuspenseQuery(queryKey, queryFn, { enabled: boolean }))
// no placeholderData
expectError(useSuspenseQuery({ queryKey, queryFn, placeholderData: boolean }))
expectError(useSuspenseQuery(queryKey, { queryFn, placeholderData: boolean }))
expectError(useSuspenseQuery(queryKey, queryFn, { placeholderData: boolean }))

// Result
// no isPlaceholderData
expectError(useSuspenseQuery(queryKey, queryFn).isPlaceholderData)
expectError(useSuspenseQuery(queryKey, queryFn, {}).isPlaceholderData)
expectError(useSuspenseQuery(queryKey, { queryFn }).isPlaceholderData)
expectError(useSuspenseQuery({ queryKey, queryFn }).isPlaceholderData)
