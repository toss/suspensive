/* eslint-disable react-hooks/rules-of-hooks */
import { expectError, expectType } from 'tsd'
import { useSuspenseQueries } from './useSuspenseQueries'

const queryKey = ['key'] as const
const queryFn = async () => 'response' as const
const boolean = Math.random() > 0.5
const select = () => 'selected' as const

type AwaitedQueryFnReturn = Awaited<ReturnType<typeof queryFn>>
type SelectReturn = Awaited<ReturnType<typeof select>>

// enabled: no
const [noEnabled, noEnabledSelect] = useSuspenseQueries({
  queries: [
    { queryKey, queryFn },
    { queryKey, queryFn, select },
  ] as const,
})
expectType<AwaitedQueryFnReturn>(noEnabled.data)
expectType<SelectReturn>(noEnabledSelect.data)
expectType<false>(noEnabled.isLoading)
expectType<false>(noEnabledSelect.isLoading)
expectType<true>(noEnabled.isSuccess)
expectType<true>(noEnabledSelect.isSuccess)
expectType<'success'>(noEnabled.status)
expectType<'success'>(noEnabledSelect.status)
expectError<keyof typeof noEnabled>('isFetching')
expectError<keyof typeof noEnabledSelect>('isFetching')
expectError<keyof typeof noEnabled>('error')
expectError<keyof typeof noEnabledSelect>('error')
expectError<keyof typeof noEnabled>('isError')
expectError<keyof typeof noEnabledSelect>('isError')
expectError(
  useSuspenseQueries({
    queries: [
      { queryKey, queryFn, suspense: false },
      { queryKey, queryFn, select, suspense: true },
    ] as const,
  })
)

// enabled: undefined
const [undefinedEnabled, undefinedEnabledSelect] = useSuspenseQueries({
  queries: [
    { enabled: undefined, queryKey, queryFn },
    { enabled: undefined, queryKey, queryFn, select },
  ],
})
expectType<AwaitedQueryFnReturn>(undefinedEnabled.data)
expectType<SelectReturn>(undefinedEnabledSelect.data)
expectType<false>(undefinedEnabled.isLoading)
expectType<false>(undefinedEnabledSelect.isLoading)
expectType<true>(undefinedEnabled.isSuccess)
expectType<true>(undefinedEnabledSelect.isSuccess)
expectType<'success'>(undefinedEnabled.status)
expectType<'success'>(undefinedEnabledSelect.status)
expectError<keyof typeof undefinedEnabled>('isFetching')
expectError<keyof typeof undefinedEnabledSelect>('isFetching')
expectError<keyof typeof undefinedEnabled>('error')
expectError<keyof typeof undefinedEnabledSelect>('error')
expectError<keyof typeof undefinedEnabled>('isError')
expectError<keyof typeof undefinedEnabledSelect>('isError')
expectError(
  useSuspenseQueries({
    queries: [
      { enabled: undefined, queryKey, queryFn, suspense: false },
      { enabled: undefined, queryKey, queryFn, select, suspense: true },
    ] as const,
  })
)

// enabled: true
const [trueEnabled, trueEnabledSelect] = useSuspenseQueries({
  queries: [
    { enabled: true, queryKey, queryFn },
    { enabled: true, queryKey, queryFn, select },
  ] as const,
})
expectType<AwaitedQueryFnReturn>(trueEnabled.data)
expectType<SelectReturn>(trueEnabledSelect.data)
expectType<false>(trueEnabled.isLoading)
expectType<false>(trueEnabledSelect.isLoading)
expectType<true>(trueEnabled.isSuccess)
expectType<true>(trueEnabledSelect.isSuccess)
expectType<'success'>(trueEnabled.status)
expectType<'success'>(trueEnabledSelect.status)
expectError<keyof typeof trueEnabled>('isFetching')
expectError<keyof typeof trueEnabledSelect>('isFetching')
expectError<keyof typeof trueEnabled>('error')
expectError<keyof typeof trueEnabledSelect>('error')
expectError<keyof typeof trueEnabled>('isError')
expectError<keyof typeof trueEnabledSelect>('isError')
expectError(
  useSuspenseQueries({
    queries: [
      { enabled: true, queryKey, queryFn, suspense: false },
      { enabled: true, queryKey, queryFn, select, suspense: true },
    ] as const,
  })
)

// enabled: false
const [falseEnabled, falseEnabledSelect] = useSuspenseQueries({
  queries: [
    { enabled: false, queryKey, queryFn },
    { enabled: false, queryKey, queryFn, select },
  ] as const,
})
expectType<undefined>(falseEnabled.data)
expectType<undefined>(falseEnabledSelect.data)
expectType<true>(falseEnabled.isLoading)
expectType<true>(falseEnabledSelect.isLoading)
expectType<false>(falseEnabled.isSuccess)
expectType<false>(falseEnabledSelect.isSuccess)
expectType<'loading'>(falseEnabled.status)
expectType<'loading'>(falseEnabledSelect.status)
expectError<keyof typeof falseEnabled>('isFetching')
expectError<keyof typeof falseEnabledSelect>('isFetching')
expectError<keyof typeof falseEnabled>('error')
expectError<keyof typeof falseEnabledSelect>('error')
expectError<keyof typeof falseEnabled>('isError')
expectError<keyof typeof falseEnabledSelect>('isError')
expectError(
  useSuspenseQueries({
    queries: [
      { enabled: false, queryKey, queryFn, suspense: false },
      { enabled: false, queryKey, queryFn, select, suspense: true },
    ] as const,
  })
)

// enabled: boolean
const [booleanEnabled, booleanEnabledSelect] = useSuspenseQueries({
  queries: [
    { enabled: boolean, queryKey, queryFn },
    { enabled: boolean, queryKey, queryFn, select },
  ],
})
expectType<AwaitedQueryFnReturn | undefined>(booleanEnabled.data)
expectType<SelectReturn | undefined>(booleanEnabledSelect.data)
expectType<boolean>(booleanEnabled.isLoading)
expectType<boolean>(booleanEnabledSelect.isLoading)
expectType<boolean>(booleanEnabled.isSuccess)
expectType<boolean>(booleanEnabledSelect.isSuccess)
expectType<'success' | 'loading'>(booleanEnabled.status)
expectType<'success' | 'loading'>(booleanEnabledSelect.status)
expectError<keyof typeof booleanEnabled>('isFetching')
expectError<keyof typeof booleanEnabledSelect>('isFetching')
expectError<keyof typeof booleanEnabled>('error')
expectError<keyof typeof booleanEnabledSelect>('error')
expectError<keyof typeof booleanEnabled>('isError')
expectError<keyof typeof booleanEnabledSelect>('isError')
expectError(
  useSuspenseQueries({
    queries: [
      { enabled: boolean, queryKey, queryFn, suspense: false },
      { enabled: boolean, queryKey, queryFn, select, suspense: true },
    ] as const,
  })
)

// noItem
expectError(useSuspenseQueries({}))
expectError(useSuspenseQueries())
