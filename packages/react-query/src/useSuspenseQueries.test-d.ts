/* eslint-disable react-hooks/rules-of-hooks */
import { expectError, expectType } from 'tsd'
import { useSuspenseQueries } from '../dist'

const queryKey = ['key'] as const
const queryFn = async () => 'response' as const
const select = () => 'selected' as const

const [query, querySelected] = useSuspenseQueries({
  queries: [
    { queryKey, queryFn },
    { queryKey, queryFn, select },
  ] as const,
})
expectType<Awaited<ReturnType<typeof queryFn>>>(query.data)
expectType<Awaited<ReturnType<typeof select>>>(querySelected.data)
expectError(
  useSuspenseQueries({
    queries: [
      { queryKey, queryFn, suspense: false },
      { queryKey, queryFn, select, suspense: true },
    ] as const,
  })
)

// noItem
expectError(useSuspenseQueries({}))
expectError(useSuspenseQueries())
