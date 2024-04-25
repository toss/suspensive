/* eslint-disable react-hooks/rules-of-hooks */
import { sleep } from '@suspensive/test-utils'
import { useSuspenseQueries } from '../dist'

const queryKey = ['key'] as const
const queryFn = () => sleep(10).then(() => ({ text: 'response' }) as const)
const boolean = Math.random() > 0.5
const select = (data: Awaited<ReturnType<typeof queryFn>>) => data.text

// enabled: no
const [noEnabled, noEnabledSelect] = useSuspenseQueries({
  queries: [
    { queryKey, queryFn },
    { queryKey, queryFn, select },
  ] as const,
})
expectTypeOf(noEnabled.data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
expectTypeOf(noEnabledSelect.data).toEqualTypeOf<ReturnType<typeof select>>()
expectTypeOf(noEnabled.isLoading).toEqualTypeOf<false>()
expectTypeOf(noEnabledSelect.isLoading).toEqualTypeOf<false>()
expectTypeOf(noEnabled.isSuccess).toEqualTypeOf<true>()
expectTypeOf(noEnabledSelect.isSuccess).toEqualTypeOf<true>()
expectTypeOf(noEnabled.status).toEqualTypeOf<'success'>()
expectTypeOf(noEnabledSelect.status).toEqualTypeOf<'success'>()
// @ts-expect-error no isFetching
noEnabled.isFetching
// @ts-expect-error no isFetching
noEnabledSelect.isFetching
// @ts-expect-error no error
noEnabled.error
// @ts-expect-error no error
noEnabledSelect.error
// @ts-expect-error no isError
noEnabled.isError
// @ts-expect-error no isError
noEnabledSelect.isError
useSuspenseQueries({
  queries: [
    // @ts-expect-error no suspense
    { queryKey, queryFn, suspense: false },
    // @ts-expect-error no suspense
    { queryKey, queryFn, select, suspense: true },
  ] as const,
})

// enabled: undefined
const [undefinedEnabled, undefinedEnabledSelect] = useSuspenseQueries({
  queries: [
    { enabled: undefined, queryKey, queryFn },
    { enabled: undefined, queryKey, queryFn, select },
  ],
})
expectTypeOf(undefinedEnabled.data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
expectTypeOf(undefinedEnabledSelect.data).toEqualTypeOf<ReturnType<typeof select>>()
expectTypeOf(undefinedEnabled.isLoading).toEqualTypeOf<false>()
expectTypeOf(undefinedEnabledSelect.isLoading).toEqualTypeOf<false>()
expectTypeOf(undefinedEnabled.isSuccess).toEqualTypeOf<true>()
expectTypeOf(undefinedEnabledSelect.isSuccess).toEqualTypeOf<true>()
expectTypeOf(undefinedEnabled.status).toEqualTypeOf<'success'>()
expectTypeOf(undefinedEnabledSelect.status).toEqualTypeOf<'success'>()
// @ts-expect-error no isFetching
undefinedEnabled.isFetching
// @ts-expect-error no isFetching
undefinedEnabledSelect.isFetching
// @ts-expect-error no error
undefinedEnabled.error
// @ts-expect-error no error
undefinedEnabledSelect.error
// @ts-expect-error no isError
undefinedEnabled.isError
// @ts-expect-error no isError
undefinedEnabledSelect.isError
useSuspenseQueries({
  queries: [
    // @ts-expect-error no suspense
    { enabled: undefined, queryKey, queryFn, suspense: false },
    // @ts-expect-error no suspense
    { enabled: undefined, queryKey, queryFn, select, suspense: true },
  ] as const,
})

// enabled: true
const [trueEnabled, trueEnabledSelect] = useSuspenseQueries({
  queries: [
    { enabled: true, queryKey, queryFn },
    { enabled: true, queryKey, queryFn, select },
  ] as const,
})
expectTypeOf(trueEnabled.data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>>>()
expectTypeOf(trueEnabledSelect.data).toEqualTypeOf<ReturnType<typeof select>>()
expectTypeOf(trueEnabled.isLoading).toEqualTypeOf<false>()
expectTypeOf(trueEnabledSelect.isLoading).toEqualTypeOf<false>()
expectTypeOf(trueEnabled.isSuccess).toEqualTypeOf<true>()
expectTypeOf(trueEnabledSelect.isSuccess).toEqualTypeOf<true>()
expectTypeOf(trueEnabled.status).toEqualTypeOf<'success'>()
expectTypeOf(trueEnabledSelect.status).toEqualTypeOf<'success'>()
// @ts-expect-error no isFetching
trueEnabled.isFetching
// @ts-expect-error no isFetching
trueEnabledSelect.isFetching
// @ts-expect-error no error
trueEnabled.error
// @ts-expect-error no error
trueEnabledSelect.error
// @ts-expect-error no isError
trueEnabled.isError
// @ts-expect-error no isError
trueEnabledSelect.isError
useSuspenseQueries({
  queries: [
    // @ts-expect-error no suspense
    { enabled: true, queryKey, queryFn, suspense: false },
    // @ts-expect-error no suspense
    { enabled: true, queryKey, queryFn, select, suspense: true },
  ] as const,
})

// enabled: false
const [falseEnabled, falseEnabledSelect] = useSuspenseQueries({
  queries: [
    { enabled: false, queryKey, queryFn },
    { enabled: false, queryKey, queryFn, select },
  ] as const,
})
expectTypeOf(falseEnabled.data).toEqualTypeOf<undefined>()
expectTypeOf(falseEnabledSelect.data).toEqualTypeOf<undefined>()
expectTypeOf(falseEnabled.isLoading).toEqualTypeOf<true>()
expectTypeOf(falseEnabledSelect.isLoading).toEqualTypeOf<true>()
expectTypeOf(falseEnabled.isSuccess).toEqualTypeOf<false>()
expectTypeOf(falseEnabledSelect.isSuccess).toEqualTypeOf<false>()
expectTypeOf(falseEnabled.status).toEqualTypeOf<'loading'>()
expectTypeOf(falseEnabledSelect.status).toEqualTypeOf<'loading'>()
// @ts-expect-error no isFetching
falseEnabled.isFetching
// @ts-expect-error no isFetching
falseEnabledSelect.isFetching
// @ts-expect-error no error
falseEnabled.error
// @ts-expect-error no error
falseEnabledSelect.error
// @ts-expect-error no isError
falseEnabled.isError
// @ts-expect-error no isError
falseEnabledSelect.isError
useSuspenseQueries({
  queries: [
    // @ts-expect-error no suspense
    { enabled: false, queryKey, queryFn, suspense: false },
    // @ts-expect-error no suspense
    { enabled: false, queryKey, queryFn, select, suspense: true },
  ] as const,
})

// enabled: boolean
const [booleanEnabled, booleanEnabledSelect] = useSuspenseQueries({
  queries: [
    { enabled: boolean, queryKey, queryFn },
    { enabled: boolean, queryKey, queryFn, select },
  ],
})
expectTypeOf(booleanEnabled.data).toEqualTypeOf<Awaited<ReturnType<typeof queryFn>> | undefined>()
expectTypeOf(booleanEnabledSelect.data).toEqualTypeOf<ReturnType<typeof select> | undefined>()
expectTypeOf(booleanEnabled.isLoading).toEqualTypeOf<boolean>()
expectTypeOf(booleanEnabledSelect.isLoading).toEqualTypeOf<boolean>()
expectTypeOf(booleanEnabled.isSuccess).toEqualTypeOf<boolean>()
expectTypeOf(booleanEnabledSelect.isSuccess).toEqualTypeOf<boolean>()
expectTypeOf(booleanEnabled.status).toEqualTypeOf<'success' | 'loading'>()
expectTypeOf(booleanEnabledSelect.status).toEqualTypeOf<'success' | 'loading'>()
// @ts-expect-error no isFetching
booleanEnabled.isFetching
// @ts-expect-error no isFetching
booleanEnabledSelect.isFetching
// @ts-expect-error no error
booleanEnabled.error
// @ts-expect-error no error
booleanEnabledSelect.error
// @ts-expect-error no isError
booleanEnabled.isError
// @ts-expect-error no isError
booleanEnabledSelect.isError
useSuspenseQueries({
  queries: [
    // @ts-expect-error no suspense
    { enabled: boolean, queryKey, queryFn, suspense: false },
    // @ts-expect-error no suspense
    { enabled: boolean, queryKey, queryFn, select, suspense: true },
  ] as const,
})

// @ts-expect-error noItem
useSuspenseQueries({})
// @ts-expect-error noItem
useSuspenseQueries()
