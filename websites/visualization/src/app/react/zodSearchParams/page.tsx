'use client'

import { wrap } from '@suspensive/react'
import { useSearchParams } from 'next/navigation'
import { ZodError, z } from 'zod'

export default wrap
  .ErrorBoundary({
    shouldCatch: ZodError,
    fallback: ({ error }) => {
      if (error instanceof ZodError) {
        return (
          <div>
            zod error:
            {error.errors.map((error) => (
              <div key={error.code}>{error.message}</div>
            ))}
          </div>
        )
      }
      throw new Error('ErrorBoundary should catch but cannot catch error of children')
    },
  })
  .on(() => {
    const searchParamsId = useSearchParams().get('id')
    const id = z.coerce
      .number({
        invalid_type_error: 'searchParam: id type should be number',
        required_error: 'searchParam: id is required',
      })
      .int('searchParam: id type should be integer')
      .min(1, 'searchParam: id type should be number bigger than 1')
      .parse(searchParamsId)

    return <div>page {id}</div>
  })
