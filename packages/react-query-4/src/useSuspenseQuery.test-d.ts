import { describe, expectTypeOf, it } from 'vitest'
import { queryOptions } from './queryOptions'
import { queryFn, queryKey } from './test-utils'
import { type UseSuspenseQueryResult, useSuspenseQuery } from './useSuspenseQuery'

describe('useSuspenseQuery', () => {
  it('type check', () => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    useSuspenseQuery({
      queryKey,
      queryFn,
      //@ts-expect-error no isPlaceholderData
    }).isPlaceholderData
    useSuspenseQuery({
      queryKey,
      queryFn,
      //@ts-expect-error no networkMode
      networkMode: 'always',
    })

    const result = useSuspenseQuery({ queryKey, queryFn })
    expectTypeOf(result).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
    expectTypeOf(result.data).toEqualTypeOf<{ text: string }>()
    expectTypeOf(result.status).toEqualTypeOf<'success'>()

    const selectedResult = useSuspenseQuery({ queryKey, queryFn, select: (data) => data.text })
    expectTypeOf(selectedResult).toEqualTypeOf<UseSuspenseQueryResult<string>>()
    expectTypeOf(selectedResult.data).toEqualTypeOf<string>()
    expectTypeOf(selectedResult.status).toEqualTypeOf<'success'>()

    const options = queryOptions({
      queryKey,
      queryFn,
    })

    const resultWithOptions = useSuspenseQuery(options)
    expectTypeOf(resultWithOptions).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
    expectTypeOf(resultWithOptions.data).toEqualTypeOf<{ text: string }>()
    expectTypeOf(resultWithOptions.status).toEqualTypeOf<'success'>()

    const selectedResultWithOptions = useSuspenseQuery({
      ...options,
      select: (data) => data.text,
    })
    expectTypeOf(selectedResultWithOptions).toEqualTypeOf<UseSuspenseQueryResult<string>>()
    expectTypeOf(selectedResultWithOptions.data).toEqualTypeOf<string>()
    expectTypeOf(selectedResultWithOptions.status).toEqualTypeOf<'success'>()
  })
})
