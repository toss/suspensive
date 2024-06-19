import { queryFn, queryKey } from '@suspensive/test-utils'
import { describe, expectTypeOf, it } from 'vitest'
import { type UseSuspenseQueryResult, useSuspenseQuery } from './useSuspenseQuery'

describe('useSuspenseQuery', () => {
  it('type error', () => {
    //@ts-expect-error no arg
    useSuspenseQuery()
    useSuspenseQuery({
      queryKey,
      queryFn,
      //@ts-expect-error no suspense
      suspense: boolean,
    })
    useSuspenseQuery({
      queryKey,
      queryFn,
      //@ts-expect-error no useErrorBoundary
      useErrorBoundary: boolean,
    })
    useSuspenseQuery({
      queryKey,
      queryFn,
      //@ts-expect-error no enabled
      enabled: boolean,
    })
    useSuspenseQuery({
      queryKey,
      queryFn,
      //@ts-expect-error no placeholderData
      placeholderData: 'placeholder',
    })
    useSuspenseQuery({
      queryKey,
      queryFn,
      //@ts-expect-error no isPlaceholderData
    }).isPlaceholderData
  })

  it('type check', () => {
    const result = useSuspenseQuery({ queryKey, queryFn })
    expectTypeOf(result).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
    expectTypeOf(result.data).toEqualTypeOf<{ text: string }>()
    expectTypeOf(result.status).toEqualTypeOf<'success'>()

    const selectedResult = useSuspenseQuery({ queryKey, queryFn, select: (data) => data.text })
    expectTypeOf(selectedResult).toEqualTypeOf<UseSuspenseQueryResult<string>>()
    expectTypeOf(selectedResult.data).toEqualTypeOf<string>()
    expectTypeOf(selectedResult.status).toEqualTypeOf<'success'>()
  })
})
